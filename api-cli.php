<?php

define( 'IMPORT_HTTP_HOST', 'www.brookdalecc.edu' );
define( 'IMPORT_SERVER_NAME', 'www.brookdalecc.edu' );
define( 'WP_SITE_SLUG', '' );

define( 'WP_SITEURL', 'http://www.brookdalecc.edu' );


define( 'DB_HOST', 'localhost' );
define( 'DB_IMPORT_USERNAME', 'root' );
define( 'DB_IMPORT_PASSWORD', 'root' );
define( 'DB_IMPORT_SCHEMA', 'local.brookdaleold.edu' );

define( 'THEME_MIGRATE_SOURCE_URL', 'http://www.brookdalecc.edu' );

/*
define( 'IMPORT_HTTP_HOST', 'testweb.brookdalecc.edu' );
define( 'IMPORT_SERVER_NAME', 'testweb.brookdalecc.edu' );
define( 'WP_SITE_SLUG', '' );

define( 'WP_SITEURL', 'https://testweb.brookdalecc.edu' );


define( 'DB_HOST', 'localhost' );
define( 'DB_IMPORT_USERNAME', 'bccwebdbuser' );
define( 'DB_IMPORT_PASSWORD', '@HBFFqVXGIjVCPgZ' );
define( 'DB_IMPORT_SCHEMA', 'brookdalewebdb' );
*/

define( 'THEME_MIGRATE_SOURCE_URL', 'http://www.brookdalecc.edu' );

$_SERVER = array(
    'SERVER_PROTOCOL' => "HTTP/1.1",
    'SERVER_PORT' => '80',
    "HTTP_HOST" => IMPORT_HTTP_HOST,
    "SERVER_NAME" => IMPORT_SERVER_NAME,
    "REQUEST_URI" => "/" . WP_SITE_SLUG . "/",
    "REQUEST_METHOD" => "GET"
);

print 'Loading...' . PHP_EOL;

error_reporting( E_ALL );
require_once(dirname( __FILE__ ) . '/../wp-load.php');


print 'Loaded' . PHP_EOL;
//add_action( 'init', 'wp_iab_cli_on_init' );

//function wp_iab_cli_on_init() {
	$sync = new WP_IAB_Synchronizer();
	$sync->sync_sites();
//}
