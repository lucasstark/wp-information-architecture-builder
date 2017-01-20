<?php

class WP_IAB_Schema {
	public function get_schema() {
		return ( file_get_contents(wpiab()->plugin_dir() . '/config/schema.json') );
	}
}