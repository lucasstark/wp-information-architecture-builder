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

		add_action( 'init', array($this, 'maybe_handle_request'), 0 );
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
		WP_IAB_Rest_Sites_Controller::register();
	}

	public function on_admin_enqueue_scripts() {

		wp_enqueue_script( 'wp-api' );
		wp_enqueue_script( 'wpiab-jstree', $this->plugin_url() . '/assets/js/jstree.js', array('jquery') );
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

	public function maybe_handle_request() {
		
		if (isset($_GET['iab-migrate'])){
			$sync = new WP_IAB_Synchronizer2();
			$sync->sync_sites();
		}
		
		if ( isset( $_GET['operation'] ) ) {
			$fs = new tree( null, array('structure_table' => 'wp_sitemap_nodemeta', 'data_table' => 'wp_sitemap_nodes', 'data' => array('nm')) );
			$api = new WP_IAB_API();

			try {
				$rslt = null;
				switch ( $_GET['operation'] ) {
					case 'analyze':
						var_dump( $fs->analyze( true ) );
						die();
						break;
					case 'get_node':
						$node_id = isset( $_GET['id'] ) && $_GET['id'] !== '#' ? (int) $_GET['id'] : 0;
						$rslt = $api->get_children( $node_id );
						break;
					case "get_content":

						$rslt = '';

						$node = isset( $_GET['id'] ) && $_GET['id'] !== '#' ? $_GET['id'] : 0;
						$node = explode( ':', $node );
						if ( count( $node ) > 1 ) {
							$rslt = array('content' => 'Multiple selected');
						} else {
							$temp = $fs->get_node( (int) $node[0], array('with_path' => true) );
							$rslt = array('content' => 'Selected: /' . implode( '/', array_map( function ($v) {
										    return $v['nm'];
									    }, $temp['path'] ) ) . '/' . $temp['nm']);
						}
						break;
					case 'create_node':
						$node = isset( $_GET['id'] ) && $_GET['id'] !== '#' ? (int) $_GET['id'] : 0;
						$temp = $fs->mk( $node, isset( $_GET['position'] ) ? (int) $_GET['position'] : 0, array('nm' => isset( $_GET['text'] ) ? $_GET['text'] : 'New node') );
						$rslt = array('id' => $temp);
						break;
					case 'rename_node':
						$node = isset( $_GET['id'] ) && $_GET['id'] !== '#' ? (int) $_GET['id'] : 0;
						$rslt = $fs->rn( $node, array('nm' => isset( $_GET['text'] ) ? $_GET['text'] : 'Renamed node') );
						break;
					case 'delete_node':
						$node = isset( $_GET['id'] ) && $_GET['id'] !== '#' ? (int) $_GET['id'] : 0;
						$rslt = $fs->rm( $node );
						break;
					case 'move_node':
						$node = isset( $_GET['id'] ) && $_GET['id'] !== '#' ? (int) $_GET['id'] : 0;
						$parn = isset( $_GET['parent'] ) && $_GET['parent'] !== '#' ? (int) $_GET['parent'] : 0;
						$rslt = $fs->mv( $node, $parn, isset( $_GET['position'] ) ? (int) $_GET['position'] : 0  );
						break;
					case 'copy_node':
						$node = isset( $_GET['id'] ) && $_GET['id'] !== '#' ? (int) $_GET['id'] : 0;
						$parn = isset( $_GET['parent'] ) && $_GET['parent'] !== '#' ? (int) $_GET['parent'] : 0;
						$rslt = $fs->cp( $node, $parn, isset( $_GET['position'] ) ? (int) $_GET['position'] : 0  );
						break;
					default:
						throw new Exception( 'Unsupported operation: ' . $_GET['operation'] );
						break;
				}
				header( 'Content-Type: application/json; charset=utf-8' );
				echo json_encode( $rslt );
			} catch ( Exception $e ) {
				header( $_SERVER["SERVER_PROTOCOL"] . ' 500 Server Error' );
				header( 'Status:  500 Server Error' );
				echo $e->getMessage();
			}
			die();
		}
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
