<?php

/**
 * Manage a WordPress site's settings.
 */
class WP_REST_Site_Controller extends WP_REST_Controller {
	private static $instance;

	public static function register() {
		if ( self::$instance == null ) {
			self::$instance = new WP_REST_Site_Controller();
			self::$instance->register_routes();
		}
	}


	public function __construct() {
		$this->namespace = 'wp/v2';
		$this->rest_base = 'sites';

		add_filter( 'site_details', array( $this, 'get_site_details' ), 10, 1 );
	}


	public function register_routes() {

		$temp = $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE );

		register_rest_route( $this->namespace, '/' . $this->rest_base, array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => $this->get_collection_params(),
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_item' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
			),
			'schema' => array( $this, 'get_item_schema' ),
		) );

		register_rest_route( $this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_item' ),
				'permission_callback' => array( $this, 'get_item_permissions_check' ),
				'args'                => array(
					'context' => $this->get_context_param( array( 'default' => 'view' ) )
				),
			),
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_item' ),
				'permission_callback' => array( $this, 'update_item_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
			),
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_item' ),
				'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				'args'                => array(
					'force' => array(
						'type'        => 'boolean',
						'default'     => false,
						'description' => __( 'Whether to bypass trash and force deletion.' ),
					),
				),
			),
			'schema' => array( $this, 'get_item_schema' ),
		) );
	}

	public function get_item_permissions_check( $request ) {
		if ( 'edit' === $request['context'] && ! current_user_can( 'manage_sites' ) ) {
			return new WP_Error( 'rest_forbidden_context', __( 'Sorry, you are not allowed to edit sites in this network.' ),
				array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}



	/**
	 * Checks if a given request has access to read posts.
	 *
	 * @since 4.7.0
	 * @access public
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {

		if ( 'edit' === $request['context'] && ! current_user_can( 'manage_sites' ) ) {
			return new WP_Error( 'rest_forbidden_context', __( 'Sorry, you are not allowed to edit sites in this network.' ),
				array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	public function create_item_permissions_check( $request ) {
		if ( ! current_user_can( 'create_sites' ) ) {
			return new WP_Error( 'rest_forbidden_context', __( 'Sorry, you are not allowed to create sites in this network.' ),
				array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	public function update_item_permissions_check( $request ) {
		if ( ! current_user_can( 'manage_sites' ) ) {
			return new WP_Error( 'rest_forbidden_context', __( 'Sorry, you are not allowed to edit this site.' ),
				array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	public function delete_item_permissions_check( $request ) {
		if ( ! current_user_can( 'delete_sites' ) ) {
			return new WP_Error( 'rest_forbidden_context', __( 'Sorry, you are not allowed to edit this site.' ),
				array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	/**
	 * Get a single site.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_item( $request ) {

		$item = get_site( (int) $request['id'] );
		$data = $this->prepare_item_for_response( $item, $request );

		return new WP_REST_Response( $data, 200 );
	}


	/**
	 * Get a collection of site settings.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {

		$items = get_sites( array(
			'orderby' => 'path'
		) );

		$data = array();

		foreach ( $items as $item ) {
			$itemdata = $this->prepare_item_for_response( $item, $request );
			$data[]   = $this->prepare_response_for_collection( $itemdata );
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Creates a new site
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {

		$prepared_data   = $this->prepare_item_for_database( $request );

		remove_filter( "default_option_WPLANG", 'filter_default_option', 10, 3 );
		$current_site_id = wpmu_create_blog( $prepared_data->domain, $prepared_data->path, $prepared_data->title, get_current_user_id(), array( 'public' => 1 ), 1 );

		if ( is_wp_error( $current_site_id ) ) {

			if ( 'db_insert_error' === $current_site_id->get_error_code() ) {
				$current_site_id->add_data( array( 'status' => 500 ) );
			} else {
				$current_site_id->add_data( array( 'status' => 400 ) );
			}

			return $current_site_id;
		}


		$site = get_site( (int) $current_site_id );

		/**
		 * Fires after a single site is created or updated via the REST API.
		 *
		 * The dynamic portion of the hook name, `$this->post_type`, refers to the post type slug.
		 *
		 * @since 4.7.0
		 *
		 * @param object $post Inserted Post object (not a WP_Post object).
		 * @param WP_REST_Request $request Request object.
		 * @param bool $creating True when creating post, false when updating.
		 */
		do_action( "rest_insert_site", $site, $request, true );

		$request->set_param( 'context', 'edit' );

		$response = $this->prepare_item_for_response( $site, $request );
		$response = rest_ensure_response( $response );

		$response->set_status( 201 );
		$response->header( 'Location', rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $current_site_id ) ) );

		return $response;
	}

	/**
	 * Creates a new site
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		global $wpdb;

		$prepared_data   = $this->prepare_item_for_database( $request );

		if ( empty( $prepared_data->id ) ) {
			return new WP_Error( 'rest_invalid_domain', __( 'Not Found.' ), array( 'status' => 404 ) );
		}

		$details = get_site( $prepared_data->id );
		$parsed_scheme = parse_url( $details->siteurl, PHP_URL_SCHEME );
		$is_main_site = is_main_site( $prepared_data->id );

		switch_to_blog( $prepared_data->id );

		// Rewrite rules can't be flushed during switch to blog.
		delete_option( 'rewrite_rules' );

		$blog_data = array();
		$blog_data['scheme'] = $parsed_scheme;

		if ( $is_main_site ) {
			// On the network's main site, don't allow the domain or path to change.
			$blog_data['domain'] = $details->domain;
			$blog_data['path'] = $details->path;
		} else {
			// For any other site, the scheme, domain, and path can all be changed. We first
			// need to ensure a scheme has been provided, otherwise fallback to the existing.
			$new_url_scheme = parse_url( $prepared_data->url, PHP_URL_SCHEME );

			$blog_data['url'] = $prepared_data->url;

			if ( ! $new_url_scheme ) {
				$blog_data['url'] = esc_url( $parsed_scheme . '://' . $prepared_data->url );
			}
			$update_parsed_url = parse_url( $blog_data['url'] );

			// If a path is not provided, use the default of `/`.
			if ( ! isset( $update_parsed_url['path'] ) ) {
				$update_parsed_url['path'] = '/';
			}

			$blog_data['scheme'] = $update_parsed_url['scheme'];
			$blog_data['domain'] = $update_parsed_url['host'];
			$blog_data['path'] = $update_parsed_url['path'];
		}

		$existing_details = get_site( $prepared_data->id );

		update_blog_details( $prepared_data->id, $blog_data );
		update_option('blogname', $prepared_data->title);


		// Maybe update home and siteurl options.
		$new_details = get_site( $prepared_data->id );

		$old_home_url = trailingslashit( esc_url( get_option( 'home' ) ) );
		$old_home_parsed = parse_url( $old_home_url );

		if ( $old_home_parsed['host'] === $existing_details->domain && $old_home_parsed['path'] === $existing_details->path ) {
			$new_home_url = untrailingslashit( esc_url_raw( $blog_data['scheme'] . '://' . $new_details->domain . $new_details->path ) );
			update_option( 'home', $new_home_url );
		}

		$old_site_url = trailingslashit( esc_url( get_option( 'siteurl' ) ) );
		$old_site_parsed = parse_url( $old_site_url );

		if ( $old_site_parsed['host'] === $existing_details->domain && $old_site_parsed['path'] === $existing_details->path ) {
			$new_site_url = untrailingslashit( esc_url_raw( $blog_data['scheme'] . '://' . $new_details->domain . $new_details->path ) );
			update_option( 'siteurl', $new_site_url );
		}



		restore_current_blog();
		/**
		 * Fires after a single site is created or updated via the REST API.
		 *
		 * The dynamic portion of the hook name, `$this->post_type`, refers to the post type slug.
		 *
		 * @since 4.7.0
		 *
		 * @param object $post Inserted Post object (not a WP_Post object).
		 * @param WP_REST_Request $request Request object.
		 * @param bool $creating True when creating post, false when updating.
		 */
		do_action( "rest_insert_site", $new_details, $request, true );

		$request->set_param( 'context', 'edit' );

		$response = $this->prepare_item_for_response( $new_details, $request );
		$response = rest_ensure_response( $response );

		$response->set_status( 201 );
		$response->header( 'Location', rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $prepared_data->id ) ) );

		return $response;
	}


	public function delete_item( $request ) {
		$id    = (int) $request['id'];

		$site = get_site($id);
		if ( empty( $id ) || empty( $site->ID) ) {
			return new WP_Error( 'rest_post_invalid_id', __( 'Invalid post ID.' ), array( 'status' => 404 ) );
		}

		$request->set_param( 'context', 'edit' );

		$previous = $this->prepare_item_for_response( $site, $request );
		$response = new WP_REST_Response();
		$response->set_data( array( 'deleted' => true, 'previous' => $previous->get_data() ) );

		if ( $id != '0' && $id != get_network()->site_id && current_user_can( 'delete_site', $id ) ) {
			wpmu_delete_blog( $id, true );
			$result = true;
		}

		if ( ! $result ) {
			return new WP_Error( 'rest_cannot_delete', __( 'The post cannot be deleted.' ), array( 'status' => 500 ) );
		}

		/**
		 * Fires immediately after a single post is deleted or trashed via the REST API.
		 *
		 * They dynamic portion of the hook name, `$this->post_type`, refers to the post type slug.
		 *
		 * @since 4.7.0
		 *
		 * @param object           $post     The deleted or trashed post.
		 * @param WP_REST_Response $response The response data.
		 * @param WP_REST_Request  $request  The request sent to the API.
		 */
		do_action( "rest_delete_site", $site, $response, $request );

		return $response;
	}

	/**
	 * Prepare a site setting for response
	 *
	 * @param  WP_Site $site The site object
	 * @param  WP_REST_Request $request
	 *
	 * @return string           $value       The option value
	 */
	public function prepare_item_for_response( $site, $request ) {

		$data   = array();
		$schema = $this->get_item_schema();

		foreach ( $schema['properties'] as $key => $settings ) {
			$mapped_key = $this->get_item_mapping( $key );
			if ( isset( $site->{$key} ) ) {
				$value = $site->{$key};
			} elseif ( isset( $site->{$mapped_key} ) ) {
				$value = $site->{$mapped_key};
			} else {
				$value = null;
			}

			$value = ( ! $value && isset( $schema['properties'][ $key ]['default'] ) ) ? $schema['properties'][ $key ]['default'] : $value;
			if ( isset( $schema['properties'][ $mapped_key ]['type'] ) ) {
				settype( $value, $schema['properties'][ $mapped_key ]['type'] );
			}

			switch ( $key ) {
				case 'slug' :
					$value = str_replace( '/', '', $value );
					break;
				default :
					break;
			}

			$data[ $key ] = $value;
		}


		return $data;
	}

	public function prepare_item_for_database( $request ) {
		global $wpdb;

		$prepared_data = new stdClass();

		// Post ID.
		if ( isset( $request['id'] ) ) {
			$prepared_data->id = absint( $request['id'] );
		}

		$schema = $this->get_item_schema();

		if ( isset( $request['domain'] ) ) {
			$prepared_data->domain = $request['domain'];
		} else {
			return new WP_Error( 'rest_invalid_domain', __( 'Invalid domain.' ), array( 'status' => 400 ) );
		}

		if ( isset( $request['title'] ) && ! empty( $request['title'] ) ) {
			$prepared_data->title = $request['title'];
		} else {
			return new WP_Error( 'rest_invalid_title', __( 'Invalid title.' ), array( 'status' => 400 ) );
		}

		if ( isset( $request['slug'] ) && empty( $request['slug'] ) ) {
			if ( empty( $request['slug'] ) ) {
				$prepared_data->path = '/' . sanitize_title( $prepared_data->title ) . '/';
			} else {
				$prepared_data->path = '/' . sanitize_title( $request['slug'] ) . '/';
			}
		} else {
			$prepared_data->path = '/' . sanitize_title( $prepared_data->title ) . '/';
		}

		$prepared_data->url = $request['domain'] . $prepared_data->path;

		return $prepared_data;

	}

	/**
	 * Get the site setting schema, conforming to JSON Schema.
	 *
	 * @return array
	 */
	public function get_item_schema() {
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'site',
			'type'       => 'object',
			'properties' => array(
				'id'            => array(
					'description' => __( 'Unique identifier for the object.' ),
					'type'        => 'integer',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'site_id'       => array(
					'description' => __( 'ID for the sites network' ),
					'type'        => 'integer',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'title'         => array(
					'description' => __( 'Site Title' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'tagline'       => array(
					'description' => __( 'Tagline' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'slug'          => array(
					'description' => __( 'An alphanumeric identifier for the site' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'arg_options' => array(
						'sanitize_callback' => array( $this, 'sanitize_slug' ),
					),
				),
				'wordpress_url' => array(
					'description' => __( 'WordPress Address (URL)' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'url'           => array(
					'description' => __( 'Site Address (URL)' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'domain'        => array(
					'description' => __( 'Site Domain' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			),
		);

		return $this->add_additional_fields_schema( $schema );
	}

	/**
	 * Get the query params for collections
	 *
	 * @return array
	 */
	public function get_collection_params() {
		return array(
			'context' => $this->get_context_param( array( 'default' => 'view' ) ),
		);
	}

	/**
	 * Return an array of option name mappings
	 *
	 * @return array
	 */
	public function get_item_mappings() {
		return array(
			'id'              => 'ID',
			'title'           => 'blogname',
			'tagline'         => 'blogdescription',
			'wordpress_url'   => 'siteurl',
			'url'             => 'home',
			'timezone_string' => 'timezone_string',
			'locale'          => 'WPLANG',
			'slug'            => 'path',
		);
	}

	/**
	 * Return the mapped option name
	 *
	 * @param  string $option_name The API option name
	 *
	 * @return string|bool         The mapped option name, or false on failure
	 */
	public function get_item_mapping( $option_name ) {
		$mappings = $this->get_item_mappings();

		return isset( $mappings[ $option_name ] ) ? $mappings[ $option_name ] : false;
	}


	public function get_site_details( $details ) {
		return $details;
	}

}
