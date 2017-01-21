<?php

/*
Plugin Name:  WordPress Information Architecture Builder ( BETA )
Plugin URI: https://github.com/lucasstark/wp-information-architecture-builder
Description: Create an information architecture for a WordPress multisite.
Version: 0.5.0
Author: Lucas Stark
Author URI: http://www.elementstark.com
Requires at least: 4.7
Tested up to: 4.7.1
*/


class WP_IAB_Main {

	/**
	 *
	 * @var WP_IAB_Main
	 */
	private static $instance;

	public static function register() {
		if ( self::$instance == null ) {
			self::$instance = new WP_IAB_Main();
		}
	}

	/**
	 * The plugin directory
	 * @var string
	 */
	private $dir;

	/**
	 * The plugin url
	 * @var string
	 */
	private $url;

	/**
	 * Assets version identifier.
	 * @var string
	 */
	public $assets_version;

	/**
	 * @var WP_IAB_Templates
	 */
	public $templates;


	/**
	 * The single instance of the plugin.
	 * @return WP_IAB_Main
	 */
	public static function instance() {
		return self::$instance;
	}

	private function __construct() {
		$this->assets_version = '1.0.0';
		$this->dir            = plugin_dir_path( __FILE__ );
		$this->url            = plugin_dir_url( __FILE__ );


		add_action( 'admin_init', array( $this, 'on_admin_init' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'on_admin_enqueue_scripts' ) );
		add_action( 'network_admin_menu', array( $this, 'on_admin_menu' ) );

		add_action( 'rest_api_init', array( $this, 'on_rest_api_init' ), 0 );

	}

	public function on_admin_init() {
		require $this->dir . '/inc/class-wp-iab-templates.php';
		$this->templates = new WP_IAB_Templates();
	}

	public function on_rest_api_init() {
		require $this->dir . '/inc/class-wp-iab-rest-endpoint-extensions.php';
		require $this->dir . '/inc/class-wp-iab-rest-sites-controller.php';

		//Boot up controllers.
		WP_IAB_Rest_Endpoint_Extensions::register();
		WP_REST_Site_Controller::register();


	}

	/**
	 * Todo:  Only load scripts on our admin page.
	 */
	public function on_admin_enqueue_scripts() {
		//Enqueue our scripts and stylesheets, and localize some labels for use in scripts.
		wp_enqueue_script( 'wp-api' );
		wp_enqueue_script( 'wpiab-jquery-flot', $this->plugin_url() . '/assets/js/lib/flot/jquery.flot.js', array( 'jquery' ), $this->assets_version, true );
		wp_enqueue_script( 'wpiab-jquery-flot-pie', $this->plugin_url() . '/assets/js/lib/flot/jquery.flot.pie.js', array( 'jquery' ), $this->assets_version, true );

		wp_enqueue_script( 'wpiab-blockui', $this->plugin_url() . '/assets/js/lib/jquery.blockui.js', array( 'jquery' ), $this->assets_version, true );
		wp_enqueue_script( 'wpiab-jstree', $this->plugin_url() . '/assets/js/lib/jstree.js', array( 'jquery' ), $this->assets_version, true );

		wp_enqueue_script( 'wpiab-main', $this->plugin_url() . '/assets/js/main.js', array(
			'jquery',
			'wp-api',
			'wpiab-blockui',
			'wpiab-jstree',
			'wpiab-jquery-flot',
			'wpiab-jquery-flot-pie'
		), $this->assets_version, true );


		wp_enqueue_style( 'wpiab-jstree', $this->plugin_url() . '/assets/css/themes/default/style.css', null, $this->assets_version );
		wp_enqueue_style( 'wpiab-font-awesome', $this->plugin_url() . '/assets/css/font-awesome.min.css', null, $this->assets_version );
		wp_enqueue_style( 'wpiab-main', $this->plugin_url() . '/assets/css/main.css', array( 'wpiab-font-awesome' ), $this->assets_version );

		$network = get_network( get_current_network_id() );

		$labels                               = new stdClass();
		$labels->migration_status_new         = __( 'New', 'wpiab' );
		$labels->migration_status_in_progress = __( 'In Progress', 'wpiab' );
		$labels->migration_status_in_review   = __( 'In Review', 'wpiab' );
		$labels->migration_status_complete    = __( 'Complete', 'wpiab' );
		$labels->new_page                     = __( 'New Page', 'wpiab' );
		$labels->new_site                     = __( 'New Site', 'wpiab' );

		$labels->root_node_text = __( 'Sites', 'wpiab' );

		$current_site_id = BLOG_ID_CURRENT_SITE;
		settype( $current_site_id, 'integer' );
		$params = array(
			'root_site_id' => $current_site_id,
			'api_url'      => esc_url_raw( rest_url() ),
			'nonce'        => wp_create_nonce( 'wp_rest' ),
			'domain'       => $network->domain,
			'labels'       => $labels
		);

		wp_localize_script( 'wpiab-main', 'wp_iab_params', $params );
		$this->json_api_client_js();
	}

	private function json_api_client_js() {
		/**
		 * @var WP_REST_Server $wp_rest_server
		 */
		global $wp_rest_server;
		// Ensure the rest server is intiialized.
		if ( empty( $wp_rest_server ) ) {
			/** This filter is documented in wp-includes/rest-api.php */
			$wp_rest_server_class = apply_filters( 'wp_rest_server_class', 'WP_REST_Server' );
			$wp_rest_server       = new $wp_rest_server_class();
			/** This filter is documented in wp-includes/rest-api.php */
			do_action( 'rest_api_init', $wp_rest_server );
		}
		// Load the schema.
		$schema_request  = new WP_REST_Request( 'GET', '/wp/v2' );
		$schema_response = $wp_rest_server->dispatch( $schema_request );
		$schema          = null;
		if ( ! $schema_response->is_error() ) {
			$schema = $schema_response->get_data();
		}

		// Localize the plugin settings and schema.
		$settings = array(
			'root'          => esc_url_raw( get_rest_url() ),
			'nonce'         => wp_create_nonce( 'wp_rest' ),
			'versionString' => 'wp/v2/',
			'schema'        => $schema,
			'cacheSchema'   => true,
		);
		/**
		 * Filter the JavaScript Client settings before localizing.
		 *
		 * Enables modifying the config values sent to the JS client.
		 *
		 * @param array $settings The JS Client settings.
		 */

		$settings = apply_filters( 'rest_js_client_settings', $settings );
		wp_localize_script( 'wp-api', 'wpApiSettings', $settings );
	}


	/**
	 * Get's the plugins URL.
	 * @return string
	 */
	public function plugin_url() {
		return untrailingslashit( plugin_dir_url( ( __FILE__ ) ) );
	}

	/**
	 * Get's the plugin file path.
	 * @return string
	 */
	public function plugin_dir() {
		return $this->dir;
	}

	/**
	 * The directory you can create in your theme to override any of the built in templates.
	 * @return string
	 */
	public function template_directory() {
		return 'wpiab/';
	}


	/**
	 * Add our menu to the Network Admin screen.
	 */
	public function on_admin_menu() {
		add_menu_page( __( 'Information Architecture' ), __( 'Architecture' ), 'network_admin', 'wpiab-main', array(
			$this,
			'page_index'
		), 'dashicons-admin-multisite' );
	}

	/**
	 * Render the page for our custom Network Admin screen. This is the main view with the tree, site and page information.
	 */
	public function page_index() {
		$this->templates->get_template( 'dashboard.php' );
	}

}

/**
 * Boot up the instance of the plugin.
 */
WP_IAB_Main::register();

/**
 * Main entry point for the plugin.
 * @return WP_IAB_Main
 */
function wpiab() {
	return WP_IAB_Main::instance();
}
