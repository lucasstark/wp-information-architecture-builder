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

		register_rest_field( 'page', 'migration_notes', array(
			'get_callback'    => array( $this, 'get_migration_notes' ),
			'update_callback' => array( $this, 'update_migration_notes' ),
			'schema'          => null,
		) );

		register_rest_field( 'page', 'migrate_source_id', array(
			'get_callback'    => array( $this, 'get_migrate_source_id' ),
			'update_callback' => array( $this, 'update_migrate_source_id' ),
			'schema'          => null,
		) );

		register_rest_field( 'page', 'migration_old_url', array(
			'get_callback'    => array( $this, 'get_migration_old_url' ),
			'update_callback' => array( $this, 'update_migration_old_url' ),
			'schema'          => null,
		) );

		register_rest_field( 'page', 'migration_status', array(
			'get_callback'    => array( $this, 'get_migration_status' ),
			'update_callback' => array( $this, 'update_migration_status' ),
			'schema'          => array(
				'description' => __( 'Migration Status', 'wpiab' ),
				'type'        => 'string',
				'enum' => array('new', 'in_progress', 'in_review', 'complete'),
				'context'     => array( 'view', 'edit' ),
			)
		) );


	}

	public function get_has_children( $object, $field_name, $request ) {
		global $wpdb;
		$has_children = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(ID) FROM $wpdb->posts WHERE post_parent = %d AND post_type = 'page' AND post_status != 'trash'", $object['id'] ) );

		return !empty( $has_children );
	}

	public function get_site_id( $object, $field_name, $request ) {
		return get_current_blog_id();
	}

	public function get_migration_notes( $object, $field_name, $request ) {
		return esc_textarea( strip_tags( get_post_meta( $object['id'], $field_name, true ) ) );
	}

	public function update_migration_notes( $value, $object, $field_name ) {
		if ( ! $value || ! is_string( $value ) ) {
			return;
		}

		return update_post_meta( $object->ID, $field_name, strip_tags( $value ) );
	}

	public function get_migration_old_url( $object, $field_name, $request ) {
		return esc_attr( html_entity_decode( strip_tags( get_post_meta( $object['id'], '_migrate_source_url', true ) ) ) );
	}

	public function update_migration_old_url( $value, $object, $field_name ) {
		if ( ! $value || ! is_string( $value ) ) {
			return;
		}

		return update_post_meta( $object->ID, '_migrate_source_url', html_entity_decode( $value ) );
	}

	public function get_migrate_source_id( $object, $field_name, $request ) {
		return esc_attr( strip_tags( get_post_meta( $object['id'], '_migrate_source_id', true ) ) );
	}

	public function update_migrate_source_id( $value, $object, $field_name ) {
		if ( ! $value || ! is_string( $value ) ) {
			return;
		}

		return update_post_meta( $object->ID, '_migrate_source_id', strip_tags( $value ) );
	}

	public function get_migration_status( $object, $field_name, $request ) {
		$result = esc_html( strip_tags( get_post_meta( $object['id'], $field_name, true ) ) );
		return empty($result) ? 'new' : $result;
	}

	public function update_migration_status( $value, $object, $field_name ) {
		if ( ! $value || ! is_string( $value ) ) {
			return;
		}

		return update_post_meta( $object->ID, $field_name, strip_tags( $value ) );
	}

	public function on_pre_insert_post( $prepared_post, $request ) {

		if ( empty( $request['parent'] ) && $request['parent'] === 0 ) {
			$prepared_post->post_parent = 0;
		}

		return $prepared_post;
	}


}