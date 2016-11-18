<?php

/**
 * Manage a WordPress site's settings.
 */
class WP_IAB_Rest_Sites_Controller extends WP_REST_Controller {

	/**
	 * @var WP_IAB_Rest_Sites_Controller
	 */
	private static $instance;

	public static function register() {
		if ( self::$instance == null ) {
			self::$instance = new WP_IAB_Rest_Sites_Controller();
			self::$instance->register_routes();
		}
	}


	protected $rest_base = 'sites';
	protected $namespace = 'wp-iab/v1';

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
		register_rest_route( $this->namespace, '/' . $this->rest_base, array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => array(),
				'permission_callback' => array( $this, 'get_item_permissions_check' ),
			),
		) );
	}

	/**
	 * Check if a given request has access to read and manage sites.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 *
	 * @return boolean
	 */
	public function get_item_permissions_check( $request ) {
		return true;
	}

	/**
	 * Get the settings.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_Error|array
	 */
	public function get_items( $request ) {
		$items = get_sites( array(
			'fields' => 'ids',
			'orderby' => 'path'
		) );

		$data = array();

		foreach( $items as $item ) {
			$itemdata = $this->prepare_item_for_response( $item, $request );
			$data[] = $this->prepare_response_for_collection( $itemdata );
		}

		return new WP_REST_Response( $data, 200 );
	}


	/**
	 * Update settings for the settings object.
	 *
	 * @param  WP_REST_Request $request Full detail about the request.
	 *
	 * @return WP_Error|array
	 */
	public function update_item( $request ) {
		return $this->get_item( $request );
	}


	/**
	 * Prepare the item for the REST response
	 *
	 * @param mixed $item WordPress representation of the item.
	 * @param WP_REST_Request $request Request object.
	 * @return mixed
	 */
	public function prepare_item_for_response( $item, $request ) {
		$site = WP_Site::get_instance($item);

		$result = array(
			'id' => $site->id,
			'title' => $site->blogname,
			'path' => $site->siteurl,
		);

		return $result;

	}


	/**
	 * Get the site setting schema, conforming to JSON Schema.
	 *
	 * @return array

	public function get_item_schema() {
	 * $schema = array(
	 * '$schema'    => 'http://json-schema.org/draft-04/schema#',
	 * 'title'      => 'settings',
	 * 'type'       => 'object',
	 * 'properties' => array(),
	 * );
	 *
	 * foreach ( $options as $option_name => $option ) {
	 * $schema['properties'][ $option_name ] = $option['schema'];
	 * }
	 *
	 * return $this->add_additional_fields_schema( $schema );
	 * }
	 */
}
