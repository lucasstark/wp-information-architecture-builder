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
		add_filter( "rest_pre_insert_page", array( $this, 'on_pre_insert_post' ), 10, 2 );
	}

	public function register_extensions() {

		register_rest_field( 'page', 'has_children', array(
			'get_callback'    => array( $this, 'get_has_children' ),
			'update_callback' => null,
			'schema'          => null,
		) );

		register_rest_field( 'page', 'site_id', array(
			'get_callback'    => array( $this, 'get_site_id' ),
			'update_callback' => null,
			'schema'          => null,
		) );


	}

	public function get_has_children( $object, $field_name, $request ) {
		global $wpdb;
		$has_children = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(ID) FROM $wpdb->posts WHERE post_parent = %d AND post_type = 'page' AND post_status = 'publish'", $object['id'] ) );

		return ! empty( $has_children );
	}

	public function get_site_id( $object, $field_name, $request ) {
		return get_current_blog_id();
	}

	public function on_pre_insert_post( $prepared_post, $request ) {

		if ( empty( $request['parent'] ) && $request['parent'] === 0 ) {
			$prepared_post->post_parent = 0;
		}

		return $prepared_post;
	}


}