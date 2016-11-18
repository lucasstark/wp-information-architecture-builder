<?php

class WP_IAB_Synchronizer2 {

	/**
	 *
	 * @var wpdb;
	 */
	protected $db;
	protected $node_table;
	protected $node_meta_table;
	private $_current_network;
	private $_current_blogs;
	private $_current_paths;
	private $_migrated_nodes;
	private $_migrated_medias;
	private $_site_home_pages;
	private $thumbnail_ids;

	public function __construct() {
		global $wpdb;
		$this->node_table = $wpdb->base_prefix . 'sitemap_nodes';
		$this->node_meta_table = $wpdb->base_prefix . 'sitemap_nodemeta';

		$this->db = &$wpdb;
	}

	public function sync_sites() {

		WPBMap::addAllMappedShortcodes();

		//temp, update everything to migrate except the home. 
		$this->db->query( "UPDATE wp_sitemap_nodes SET node_sync_status = 'migrate' WHERE ID > 1" );

		$nodes = $this->db->get_results( "SELECT * FROM {$this->node_table} nt WHERE nt.node_type = 'site' AND nt.ID != 877 AND nt.ID > 1 ORDER BY node_order" );
		foreach ( $nodes as $node ) {
			$this->sync_site( $node );
		}
		die();
	}

	public function sync_site( $node ) {
		$site_id = false;
		switch ( $node->node_sync_status ) {
			case 'migrate':
				$site_id = $this->create_site( $node );

				if ( $site_id ) {
					$this->prepare_site_for_migration( $site_id );
					$home_id = $this->migrate_post( $site_id, $node );
					if ( $home_id ) {
						switch_to_blog( $site_id );
						update_option( 'show_on_front', 'page' );
						update_option( 'page_on_front', $home_id );
						restore_current_blog();

						$this->_site_home_pages[$site_id] = $home_id;
					}

					$this->sync_children( $site_id, $node, true );
					$this->close_site_for_migration( $site_id );
				}
				break;
			case 'create':
				$site_id = $this->create_site( $node );

				$post_data = array(
				    'post_type' => 'page',
				    'post_status' => 'publish',
				    'post_title' => $node['node_title'] . '(Home)',
				    'post_parent' => 0
				);

				$post_meta = array();
				$home_id = $this->create_post( $post_data, $post_meta, $node );
				if ( $home_id ) {
					switch_to_blog( $site_id );
					update_option( 'show_on_front', 'page' );
					update_option( 'page_on_front', $home_id );
					restore_current_blog();

					$this->_site_home_pages[$site_id] = $home_id;
				}
			case 'update':
				$site_id = $this->create_site( $node );
			default :
				break;
		}

		if ( $site_id ) {
			//$this->sync_children( $site_id, $node, true );
		}

		return $site_id;
	}

	public function sync_children( $target_site_id, $node, $recurse = false ) {
		//Ensure the node itself has been migrated. 
		$nodes = $this->db->get_results( $this->db->prepare( "SELECT * FROM {$this->node_table} WHERE node_parent = %d", $node->ID ) );

		if ( empty( $nodes ) ) {
			return;
		}

		foreach ( $nodes as $child_node ) {
			switch ( $child_node->node_sync_status ) {
				case 'migrate' :
					$id = $this->migrate_post( $target_site_id, $child_node );
					if ( $recurse ) {
						$this->sync_children( $target_site_id, $child_node, true );
					}
					break;
				default :
					break;
			}
		}
	}

	public function create_site( $node ) {
		$action = '';

		$this->_current_network = get_current_site();
		$this->_current_blogs = $this->db->get_results( "SELECT blog_id, path FROM {$this->db->base_prefix}blogs", OBJECT_K );
		$this->_current_paths = wp_list_pluck( $this->_current_blogs, 'path' );

		$slug = false;
		if ( empty( $slug ) || preg_match( '/[^a-z0-9_\-]/', $slug ) ) {
			$slug = sanitize_title( $node->node_title );
		}

		$path = '/' . $slug . '/';

		$current_site_id = false;
		if ( in_array( $path, $this->_current_paths ) ) {
			foreach ( $this->_current_blogs as $current_blog_id => $current_blog ) {
				if ( $current_blog->path == $path ) {
					$action = 'updated';
					$current_site_id = $current_blog_id;
				}
			}
		}


		if ( !empty( $current_site_id ) ) {
			wpmu_delete_blog( $current_site_id, true );
			$current_site_id = false;
		}

		if ( empty( $current_site_id ) ) {
			$action = 'created';
			$current_site_id = wpmu_create_blog( $this->_current_network->domain, $path, $node->node_title, 1, array('public' => 1), 1 );
		}

		if ( $current_site_id && !is_wp_error( $current_site_id ) && $current_site_id > 1 ) {
			$this->create_log_entry( "Site $current_site_id $path $action" );

			add_user_to_blog( $current_site_id, 1, 'administrator' );
			add_user_to_blog( $current_site_id, 8, 'administrator' );
			add_user_to_blog( $current_site_id, 263, 'administrator' );
			add_user_to_blog( $current_site_id, 236, 'administrator' );
			add_user_to_blog( $current_site_id, 167, 'administrator' );

			if ( switch_to_blog( $current_site_id ) ) {
				//Delete the sample page that get's created
				$this->delete_post( 'sample-page' );

				wp_delete_post( 1 );
				wp_delete_comment( 1 );

				if ( defined( 'WP_DEFAULT_THEME' ) ) {
					$theme = WP_DEFAULT_THEME;
					switch_theme( $theme );
					//this is weird, but it would appear there might be a bug with switch theme in that it doesn't switch the current_theme. But if we kill it then the code runs to reset it.
					update_option( 'current_theme', '' );
				}
			}

			restore_current_blog();
			return $current_site_id;
		}
	}

	public function prepare_site_for_migration( $site_id ) {
		switch_to_blog( $site_id );

		$sql = "ALTER TABLE {$this->db->posts} CHANGE COLUMN `ID` `ID` BIGINT(20) UNSIGNED NOT NULL ;";

		$this->db->query( $sql );

		restore_current_blog();
	}

	public function close_site_for_migration( $site_id ) {
		switch_to_blog( $site_id );

		$sql = "ALTER TABLE {$this->db->posts} CHANGE COLUMN `ID` `ID` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT ;";
		$this->db->query( $sql );

		$max = $this->db->get_var( "SELECT ID FROM {$this->db->posts} ORDER BY ID ASC" );
		$auto_increment_value = $max + 1000;

		$auto_increment_sql = "ALTER TABLE {$this->db->posts}  AUTO_INCREMENT = $auto_increment_value ;";
		$this->db->query( $auto_increment_sql );

		restore_current_blog();
	}

	private function _migrate_media( $target_site_id, $node, $media_ids ) {
		if ( !isset( $this->_migrated_medias[$target_site_id] ) ) {
			$this->_migrated_medias[$target_site_id] = array();
		}

		if ( (int) $node->node_wp_site_id === 1 ) {
			$source_prefix = $this->db->base_prefix;
		} else {
			$source_prefix = $this->db->base_prefix . $node->node_wp_site_id . '_';
		}

		foreach ( $media_ids as $post_id => $attachment ) {

			$media_node = new stdClass();
			$media_node->ID = $post_id;

			if ( array_key_exists( $post_id, $this->_migrated_medias[$target_site_id] ) ) {
				continue;
			}

			$post_data = $this->db->get_row( $this->db->prepare( "SELECT * FROM {$source_prefix}posts WHERE ID = %d", $post_id ), ARRAY_A );
			if ( empty( $post_data ) || is_wp_error( $post_data ) ) {
				$this->create_log_entry( sprintf( __( 'Can not locate media item %d in table %s for post %d' ), (int) $post_id, $source_prefix . 'posts', $node->node_wp_id ) );
				$this->create_log_entry( print_r( $node, true ) );
				continue;
			}

			$post_meta = $this->db->get_results( $this->db->prepare( "SELECT * FROM {$source_prefix}postmeta WHERE post_id = %d", $post_id ), ARRAY_A );


			$attach_id = $this->create_post( $post_data, $post_meta, $media_node );

			if ( $attach_id == 57609 ) {
				$x = 1;
			}

			$this->_migrated_medias[$target_site_id][$post_id] = $attach_id;


			$uploads = wp_upload_dir();

			$copy_path = $uploads['basedir'] . $attachment['file_relative'];
			$destination_dir = dirname( $copy_path );
			if ( !file_exists( $destination_dir ) ) {
				mkdir( $destination_dir, 0777, true );
			}

			copy( $attachment['abs'], $copy_path );
			if ( $attachment['type'] == 'image' ) {
				$attach_data = wp_generate_attachment_metadata( $attach_id, $copy_path );
				wp_update_attachment_metadata( $attach_id, $attach_data );
			}

			/*
			  if ( isset( $attachment['sizes'] ) ) {
			  foreach ( $attachment['sizes'] as $size ) {
			  if ( !file_exists( $size['abs'] ) ) {
			  continue;
			  }

			  $copy_path = $uploads['basedir'] . $size['relative'];
			  $destination_dir = dirname( $copy_path );
			  if ( !file_exists( $destination_dir ) ) {
			  mkdir($destination_dir, 0777, true);
			  }

			  copy( $size['abs'], $copy_path );
			  }
			  }
			 */
		}
	}

	public function migrate_post( $target_site_id, $node ) {
		global $shortcode_tags;

		switch_to_blog( (int) $node->node_wp_site_id );

		if ( (int) $node->node_wp_site_id === 1 ) {
			$source_prefix = $this->db->base_prefix;
		} else {
			$source_prefix = $this->db->base_prefix . $node->node_wp_site_id . '_';
		}

		$post_data = $this->db->get_row( $this->db->prepare( "SELECT * FROM {$source_prefix}posts WHERE ID = %d", $node->node_wp_id ), ARRAY_A );
		if ( empty( $post_data ) || is_wp_error( $post_data ) ) {
			$this->create_log_entry( sprintf( __( 'Can not locate source item %d in table %s' ), $node->node_wp_id, $source_prefix . 'posts' ) );
			return false;
		}

		//Setup the new parent ID;
		if ( isset( $this->_migrated_nodes[$target_site_id] ) && isset( $this->_migrated_nodes[$target_site_id][$node->node_parent] ) ) {
			$post_data['post_parent'] = $this->_migrated_nodes[$target_site_id][$node->node_parent]['post_id'];
		}

		//Make parent 0 if post parent is the homepage. 
		if ( isset( $this->_site_home_pages[$target_site_id] ) ) {
			if ( $this->_site_home_pages[$target_site_id] == $post_data['post_parent'] ) {
				$post_data['post_parent'] = 0;
			}
		}

		/*
		  $content = $post_data['post_content'];
		  preg_match_all( '@\[([^<>&/\[\]\x00-\x20=]++)@', $content, $matches );
		  $tagnames = $matches[1];

		  if ( !empty( $tagnames ) ) {
		  $pattern = get_shortcode_regex( $tagnames );
		  //do_shortcode( $source_prefix );
		  $matches = array();
		  $content = preg_replace_callback( "/$pattern/", array($this, 'do_shortcode_tag'), $content );
		  }
		 */

		$this->thumbnail_ids = array();
		add_filter( 'wp_get_attachment_image_src', array($this, 'on_wp_get_attachment_image_src'), 10, 4 );
		apply_filters( 'the_content', $post_data['post_content'] );
		remove_filter( 'wp_get_attachment_image_src', array($this, 'on_wp_get_attachment_image_src'), 10, 4 );

		foreach ( array_keys( $this->thumbnail_ids ) as $attachment_id ) {
			$this->thumbnail_ids[$attachment_id] = $this->__get_attachment( $attachment_id );
		}

		if ( $post_data['post_type'] == 'page' ) {
			$featured_images = get_field( 'featured_images', $node->node_wp_id );
			if ( $featured_images ) {
				foreach ( $featured_images as $acf_fi ) {
					if ( !empty( $acf_fi['featured_image']['id'] ) ) {
						$this->thumbnail_ids[$acf_fi['featured_image']['id']] = $this->__get_attachment( $acf_fi['featured_image']['id'] );
					}
				}
			}

			$page_grid = get_field( 'page_grid', $node->node_wp_id );
			if ( $page_grid ) {
				foreach ( $page_grid as $pg ) {
					if ( !empty( $pg['item_image'] ) ) {
						$this->thumbnail_ids[$pg['item_image']] = $this->__get_attachment( $pg['item_image'] );
					}
				}
			}
		}


		$post_meta = $this->db->get_results( $this->db->prepare( "SELECT * FROM {$source_prefix}postmeta WHERE post_id = %d", $node->node_wp_id ), ARRAY_A );
		restore_current_blog();

		switch_to_blog( $target_site_id );

		$id = $this->create_post( $post_data, $post_meta, $node );

		$this->_migrated_nodes[$target_site_id][$node->ID] = array(
		    'post_id' => $id,
		    'node' => $node,
		);

		if ( $id ) {

			//Migrate Media
			if ( !empty( $this->thumbnail_ids ) ) {
				$this->_migrate_media( $target_site_id, $node, $this->thumbnail_ids );
			}

			//Trash original item. 
			$this->db->query( $this->db->prepare( "DELETE FROM {$source_prefix}posts WHERE ID = %d", $node->node_wp_id ) );
			$this->db->query( $this->db->prepare( "DELETE FROM {$source_prefix}postmeta WHERE post_id = %d", $node->node_wp_id ), ARRAY_A );
		}

		restore_current_blog();

		return $id;
	}

	protected function create_post( $post_data, $post_meta, $node ) {
		$id = false;
		$maybe_exists = false;

		$entries = $this->db->get_col( $this->db->prepare( "SELECT post_id FROM {$this->db->postmeta} WHERE meta_value = '%s' and meta_key = '_wp_iab_node_id'", $node->ID ) );
		if ( $entries && count( $entries ) == 1 ) {
			$maybe_exists = $entries[0];
		}

		if ( !$maybe_exists ) {
			$this->create_log_entry( 'Created ' . $post_data['post_type'] . ' ' . $post_data['post_title'] );
			//unset( $post_data['ID'] );
			//$id = wp_insert_post( $post_data );

			$this->db->insert( $this->db->posts, $post_data );
			$id = $post_data['ID'];
		} else {
			$this->create_log_entry( 'Updated ' . $post_data['post_type'] . ' ' . $post_data['post_title'] );
			$post_data['ID'] = $maybe_exists;
			//$id = wp_update_post( $post_data );
		}

		if ( empty( $id ) ) {
			return false;
		}

		if ( !empty( $post_meta ) ) {
			unset( $post_meta['_wp_iab_node_id'] );
			foreach ( $post_meta as $meta_data ) {
				update_post_meta( $id, $meta_data['meta_key'], $meta_data['meta_value'] );
			}
		}

		update_post_meta( $id, '_wp_iab_node_id', $node->ID );
		return $id;
	}

	protected function delete_post( $slug ) {
		$page_found = $this->db->get_var( "SELECT ID FROM " . $this->db->posts . " WHERE post_name = '$slug' LIMIT 1;" );
		if ( $page_found ) {
			wp_delete_post( $page_found, true );
		}
	}

	public function create_log_entry( $message ) {
		print $message . PHP_EOL;
	}

	public function do_shortcode_tag( $atts = '', $content = '' ) {
		if ( $atts[2] == 'gravityform' ) {
			$x = 1;
		}

		return;
	}

	public function on_wp_get_attachment_image_src( $image, $attachment_id, $size, $icon ) {
		$this->thumbnail_ids[$attachment_id] = array();
	}

	private function __get_attachment( $post ) {

		// get postß
		if ( !$post = get_post( $post ) ) {
			return false;
		}

		$uploads = wp_upload_dir();

		// vars
		$thumb_id = 0;
		$id = $post->ID;
		$a = array(
		    'ID' => $id,
		    'id' => $id,
		    'title' => $post->post_title,
		    'filename' => wp_basename( $post->guid ),
		    'url' => wp_get_attachment_url( $id ),
		    'alt' => get_post_meta( $id, '_wp_attachment_image_alt', true ),
		    'author' => $post->post_author,
		    'description' => $post->post_content,
		    'caption' => $post->post_excerpt,
		    'name' => $post->post_name,
		    'date' => $post->post_date_gmt,
		    'modified' => $post->post_modified_gmt,
		    'mime_type' => $post->post_mime_type,
		    'icon' => wp_mime_type_icon( $id )
		);

		$t = explode( '/', $post->post_mime_type );
		$a['type'] = isset( $t[0] ) ? $t[0] : '';
		// video may use featured image

		$a['abs'] = str_replace( $uploads['baseurl'], $uploads['basedir'], $a['url'] );
		$a['file_relative'] = str_replace( $uploads['basedir'], '', $a['abs'] );

		if ( $a['type'] === 'image' ) {

			$thumb_id = $id;
			$src = wp_get_attachment_image_src( $id, 'full' );

			$a['url'] = $src[0];
			$a['width'] = $src[1];
			$a['height'] = $src[2];
		} elseif ( $a['type'] === 'audio' || $a['type'] === 'video' ) {

			// video dimentions
			if ( $a['type'] == 'video' ) {

				$meta = wp_get_attachment_metadata( $id );
			}


			// feature image
			if ( $featured_id = get_post_thumbnail_id( $id ) ) {

				$thumb_id = $featured_id;
			}
		}


		// sizes
		if ( $thumb_id ) {

			// find all image sizes
			if ( $sizes = get_intermediate_image_sizes() ) {

				$a['sizes'] = array();

				foreach ( $sizes as $size ) {

					// url
					$src = wp_get_attachment_image_src( $thumb_id, $size );

					$file_path = str_replace( $uploads['baseurl'], $uploads['basedir'], $src[0] );

					// add src
					$a['sizes'][$size] = array(
					    'abs' => $file_path,
					    'relative' => str_replace( $uploads['basedir'], '', $file_path )
					);
				}
			}
		}


		// return
		return $a;
	}

}
