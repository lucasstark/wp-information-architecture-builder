<?php

class WP_IAB_Templates {


	public function __construct() {

	}


	/**
	 * Get template part (for templates like the content-<NAME>).
	 *
	 * @access public
	 * @param mixed $slug
	 * @param string $name (default: '')
	 * @return void
	 */
	public function get_template_part( $slug, $names = '', $args = array() ) {
		$template = '';

		if ( !is_array( $names ) ) {
			$names = array($names);
		}

		foreach ( $names as $name ) {

			if ( $name ) {
				$template = locate_template( array("{$slug}-{$name}.php", wpiab()->template_dir() . "{$slug}-{$name}.php") );
			}

			// Get default slug-name.php
			if ( !$template && $name && file_exists( wpiab()->plugin_dir() . "/templates/{$slug}-{$name}.php" ) ) {
				$template = wpiab()->plugin_dir() . "/templates/{$slug}-{$name}.php";
			}

			if ( $template ) {
				break;
			}
		}

		// If template file doesn't exist, look in yourtheme/slug.php and yourtheme/ecc/slug.php
		if ( !$template ) {
			$template = locate_template( array("{$slug}.php", wpiab()->template_directory() . "{$slug}.php") );
		}

		if ( !$template && file_exists( wpiab()->plugin_dir() . "/templates/{$slug}.php" ) ) {
			$template = wpiab()->plugin_dir() . "/templates/{$slug}.php";
		}

		// Allow 3rd party plugin filter template file from their plugin
		$template = apply_filters( 'wpiab_get_template_part', $template, $slug, $names );

		if ( $template ) {
			global $posts, $post, $wp_did_header, $wp_query, $wp_rewrite, $wpdb, $wp_version, $wp, $id, $comment, $user_ID;
			if ( is_array( $wp_query->query_vars ) ) {
				extract( $wp_query->query_vars, EXTR_SKIP );
			}
			
			if (  is_array( $args) ){
				extract($args);
			}

			require( $template );
		}
	}

	/**
	 * 
	 * @access public
	 * @param string $template_name
	 * @param array $args (default: array())
	 * @param string $template_path (default: '')
	 * @param string $default_path (default: '')
	 * @return void
	 */
	public function get_template( $template_name, $args = array(), $template_path = '', $default_path = '' ) {
		if ( $args && is_array( $args ) ) {
			extract( $args );
		}

		$located = $this->locate_template( $template_name, $template_path, $default_path );

		if ( !file_exists( $located ) ) {
			_doing_it_wrong( __FUNCTION__, sprintf( '<code>%s</code> does not exist.', $located ), '2.1' );
			return;
		}

		// Allow 3rd party plugin filter template file from their plugin
		$located = apply_filters( 'wpiab_get_template', $located, $template_name, $args, $template_path, $default_path );

		do_action( 'wpiab_before_template_part', $template_name, $template_path, $located, $args );

		include( $located );

		do_action( 'wpiab_after_template_part', $template_name, $template_path, $located, $args );
	}

	/**
	 * Locate a template and return the path for inclusion.
	 *
	 * This is the load order:
	 *
	 * 		yourtheme		/	$template_path	/	$template_name
	 * 		yourtheme		/	$template_name
	 * 		$default_path	/	$template_name
	 *
	 * @access public
	 * @param string $template_name
	 * @param string $template_path (default: '')
	 * @param string $default_path (default: '')
	 * @return string
	 */
	public function locate_template( $template_name, $template_path = '', $default_path = '' ) {
		if ( !$template_path ) {
			$template_path = wpiab()->template_directory();
		}

		if ( !$default_path ) {
			$default_path = wpiab()->plugin_dir() . '/templates/';
		}

		// Look within passed path within the theme - this is priority
		$template = locate_template(
			array(
			    trailingslashit( $template_path ) . $template_name
			)
		);

		// Get default template
		if ( !$template ) {
			$template = $default_path . $template_name;
		}

		// Return what we found
		return apply_filters( 'wpiab_locate_template', $template, $template_name, $template_path );
	}

}
