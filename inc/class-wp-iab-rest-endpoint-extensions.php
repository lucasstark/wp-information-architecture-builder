<?php


class WP_IAB_Rest_Endpoint_Extensions {
	/**
	 * @var WP_IAB_Rest_Endpoint_Extensions
	 */
	private static $instance;

	public static function register() {
		if ( self::$instance == null ) {
			self::$instance == new WP_IAB_Rest_Endpoint_Extensions();
		}
	}

	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_extensions' ) );
	}

	public function register_extensions() {

		register_rest_field( 'page', 'has_children', array(
			'get_callback'    => array( $this, 'get_has_children' ),
			'update_callback' => null,
			'schema'          => null,
		) );


	}

	public function get_has_children( $object, $field_name, $request ) {
		global $wpdb;
		$has_children = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(ID) FROM $wpdb->posts WHERE post_parent = %d AND post_type = 'page' AND post_status = 'publish'", $object['id'] ) );
		return !empty($has_children);
	}


}