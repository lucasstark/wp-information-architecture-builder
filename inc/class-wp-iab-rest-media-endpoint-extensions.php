<?php


class WP_IAB_Rest_Media_Endpoint_Extensions extends WP_REST_Attachments_Controller {
	/**
	 * @var WP_IAB_Rest_Media_Endpoint_Extensions
	 */
	private static $instance;

	public static function register() {
		if ( self::$instance == null ) {
			self::$instance = new WP_IAB_Rest_Media_Endpoint_Extensions( 'attachment' );
			self::$instance->register_routes();
		}
	}

	public function __construct( $post_type ) {
		add_filter( 'rest_endpoints', array( $this, 'filter_rest_endpoints' ), 10, 1 );
		parent::__construct( $post_type );
	}

	public function filter_rest_endpoints( $endpoints ) {
		return $endpoints;
	}

	/**
	 * Creates a single attachment.
	 *
	 * @since 4.7.0
	 * @access public
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_Error|WP_REST_Response Response object on success, WP_Error object on failure.
	 */
	private function add_files_to_request( $request ) {
		if ( ! empty( $request['post'] ) && in_array( get_post_type( $request['post'] ), array(
				'revision',
				'attachment'
			), true )
		) {
			return new WP_Error( 'rest_invalid_param', __( 'Invalid parent type.' ), array( 'status' => 400 ) );
		}

		/** Include admin functions to get access to wp_handle_upload() */
		require_once ABSPATH . 'wp-admin/includes/admin.php';

		$url_parts   = parse_url( $request['sideload_source_url'] );
		$filepointer = download_url( $request['sideload_source_url'] );
		$filesize    = filesize( $filepointer );
		$request->set_file_params( array(
			'file' => array(
				'name'     => pathinfo( $url_parts['path'], PATHINFO_FILENAME ) . '.' . pathinfo( $url_parts['path'], PATHINFO_EXTENSION ),
				'tmp_name' => $filepointer,
				'error'    => UPLOAD_ERR_OK,
				'size'     => $filesize,
			)
		) );

		return $request;
	}


	/**
	 * Creates a single attachment.
	 *
	 * @since 4.7.0
	 * @access public
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_Error|WP_REST_Response Response object on success, WP_Error object on failure.
	 */
	public function create_item( $request ) {

		if ( ! empty( $request['post'] ) && in_array( get_post_type( $request['post'] ), array(
				'revision',
				'attachment'
			), true )
		) {
			return new WP_Error( 'rest_invalid_param', __( 'Invalid parent type.' ), array( 'status' => 400 ) );
		}

		$request = $this->add_files_to_request( $request );

		$response = parent::create_item( $request );

		return $response;
	}

	/**
	 * Handles an upload via multipart/form-data ($_FILES).
	 *
	 * @since 4.7.0
	 * @access protected
	 *
	 * @param array $files Data from the `$_FILES` superglobal.
	 * @param array $headers HTTP headers from the request.
	 *
	 * @return array|WP_Error Data from wp_handle_upload().
	 */
	protected function upload_from_file( $files, $headers ) {
		if ( empty( $files ) ) {
			return new WP_Error( 'rest_upload_no_data', __( 'No data supplied.' ), array( 'status' => 400 ) );
		}

		// Verify hash, if given.
		if ( ! empty( $headers['content_md5'] ) ) {
			$content_md5 = array_shift( $headers['content_md5'] );
			$expected    = trim( $content_md5 );
			$actual      = md5_file( $files['file']['tmp_name'] );

			if ( $expected !== $actual ) {
				return new WP_Error( 'rest_upload_hash_mismatch', __( 'Content hash did not match expected.' ), array( 'status' => 412 ) );
			}
		}

		// Pass off to WP to handle the actual upload.
		$overrides = array(
			'test_form' => false,
		);

		$overrides['action'] = 'wp_handle_sideload';

		/** Include admin functions to get access to wp_handle_upload() */
		require_once ABSPATH . 'wp-admin/includes/admin.php';

		$file = wp_handle_sideload( $files['file'], $overrides );

		if ( isset( $file['error'] ) ) {
			return new WP_Error( 'rest_upload_unknown_error', $file['error'], array( 'status' => 500 ) );
		}

		return $file;
	}


}