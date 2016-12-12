<?php

/*
 * Plugin Name:  WordPress Information Architecture Builder
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

	public $dir;

	public $url;

	/**
	 * Assets version identifier. 
	 * @var string 
	 */
	public $assets_version;

	/**
	 * The single instance of the plugin. 
	 * @return WP_IAB_Main
	 */
	public static function instance() {
		return self::$instance;
	}

	private function __construct() {
		$this->dir = plugin_dir_path(__FILE__);
		$this->url = plugin_dir_url(__FILE__);


		add_action( 'admin_enqueue_scripts', array($this, 'on_admin_enqueue_scripts') );
		add_action( 'network_admin_menu', array($this, 'on_admin_menu') );

		require_once 'api.php';
		require_once 'wp-information-architecture-builder-api.php';
		
		require_once 'inc/class-wp-iab-syncronizer-brookdale.php';
		
		//add_action( 'admin_print_scripts', array($this, 'maybe_handle_request'), 100 );

		add_action('rest_api_init', array($this, 'on_rest_api_init'), 0);
		
	}

	public function on_rest_api_init(){
		require $this->dir . '/inc/class-wp-iab-rest-endpoint-extensions.php';
		require $this->dir . '/inc/class-wp-iab-rest-sites-controller.php';


		//Boot up controllers.
		WP_IAB_Rest_Endpoint_Extensions::register();
		WP_REST_Site_Controller::register();
	}

	public function on_admin_enqueue_scripts() {

		wp_enqueue_script( 'wp-api' );
		wp_enqueue_script( 'wpiab-jstree', $this->plugin_url() . '/assets/js/jstree.js', array('jquery') );
		//wp_enqueue_script( 'wpiab-app', $this->plugin_url() . '/assets/js/app.js', array('jquery', 'wp-api', 'wpiab-jstree'), $this->assets_version, true );
		wp_enqueue_script( 'wpiab-main', $this->plugin_url() . '/assets/js/main.js', array('jquery', 'wp-api', 'wpiab-jstree'), $this->assets_version, true );

		wp_enqueue_style( 'wpiab-jstree', $this->plugin_url() . '/assets/css/themes/default/style.css', null, $this->assets_version );
		
		wp_enqueue_style( 'wpiab-font-awesome', $this->plugin_url() . '/assets/css/font-awesome.min.css', null, $this->assets_version );
		wp_enqueue_style( 'wpiab-main', $this->plugin_url() . '/assets/css/main.css', array('wpiab-font-awesome'), $this->assets_version );

		$params = array(
		    'api_url' => esc_url_raw(rest_url()),
			'nonce' => wp_create_nonce('wp_rest')
		);

		wp_localize_script( 'wpiab-main', 'wp_iab_params', $params );
	}

	public function on_admin_menu() {
		add_menu_page( __( 'Information Architecture' ), __( 'Architecture' ), 'network_admin', 'wpiab-main', array($this, 'page_index') );
	}

	public function page_index() {
		require 'views/index.php';
	}

	public function plugin_url() {
		return untrailingslashit( plugin_dir_url( ( __FILE__ ) ) );
	}

}

WP_IAB_Main::register();

/**
 * Main entry point for the plugin. 
 * @return WP_IAB_Main
 */
function wpiab() {
	return WP_IAB_Main::instance();
}
