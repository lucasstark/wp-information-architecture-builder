<?php

class WP_IAB_Synchronizer {

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
	private $_site_home_pages;

	public function __construct() {
		global $wpdb;
		$this->node_table = $wpdb->base_prefix . 'sitemap_nodes';
		$this->node_meta_table = $wpdb->base_prefix . 'sitemap_nodemeta';

		$this->db = $wpdb;
	}

	public function sync_sites() {

		//temp, update everything to migrate except the home. 
		//$this->db->query("UPDATE wp_sitemap_nodes SET node_sync_status = 'migrate' WHERE ID > 1");

		$nodes = $this->db->get_results( "SELECT * FROM {$this->node_table} nt WHERE nt.node_type = 'site' AND nt.ID > 1 ORDER BY node_order" );
		foreach ( $nodes as $node ) {
			$node->node_sync_status = 'update';
			$this->sync_site( $node );
		}
	}

	public function sync_site( $node ) {
		$site_id = false;
		switch ( $node->node_sync_status ) {
			case 'migrate':
				$site_id = $this->create_site( $node );
				
				
				
				if ( $site_id ) {
					$home_id = $this->migrate_post( $site_id, $node );
					if ( $home_id ) {
						switch_to_blog( $site_id );
						update_option( 'show_on_front', 'page' );
						update_option( 'page_on_front', $home_id );
						restore_current_blog();

						$this->_site_home_pages[$site_id] = $home_id;
					}
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
			$this->sync_children( $site_id, $node, true );
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
						$this->sync_children( $target_site_id, $child_node );
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
			$this->create_log_entry( "Site $path $action" );

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

	public function migrate_post( $target_site_id, $node ) {

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


		$post_meta = $this->db->get_results( $this->db->prepare( "SELECT * FROM {$source_prefix}postmeta WHERE post_id = %d", $node->node_wp_id ), ARRAY_A );
		switch_to_blog( $target_site_id );

		$id = $this->create_post( $post_data, $post_meta, $node );

		restore_current_blog();

		$this->_migrated_nodes[$target_site_id][$node->ID] = array(
		    'post_id' => $id,
		    'node' => $node,
		);

		if ( $id ) {
			//Trash original item. 
			$this->db->query( $this->db->prepare( "DELETE FROM {$source_prefix}posts WHERE ID = %d", $node->node_wp_id ) );
			$this->db->query( $this->db->prepare( "DELETE FROM {$source_prefix}postmeta WHERE post_id = %d", $node->node_wp_id ), ARRAY_A );
		}

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
			unset( $post_data['ID'] );
			$id = wp_insert_post( $post_data );
		} else {
			$this->create_log_entry( 'Updated ' . $post_data['post_type'] . ' ' . $post_data['post_title'] );
			$post_data['ID'] = $maybe_exists;
			$id = wp_update_post( $post_data );
		}

		if ( empty( $id ) ) {
			return false;
		}

		if ( !empty( $post_meta ) ) {
			unset( $post_meta['_wp_iab_node_id'] );
			foreach ( $post_meta as $meta_key => $meta_value ) {
				update_post_meta( $id, $meta_key, $meta_value );
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

}
