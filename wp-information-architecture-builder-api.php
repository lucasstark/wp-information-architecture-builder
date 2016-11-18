<?php

class WP_IAB_API {

	/**
	 *
	 * @var wpdb;
	 */
	protected $db;
	protected $node_table;
	protected $node_meta_table;

	public function __construct() {
		global $wpdb;
		$this->node_table = $wpdb->base_prefix . 'sitemap_nodes';
		$this->node_meta_table = $wpdb->base_prefix . 'sitemap_nodemeta';

		$this->db = $wpdb;
	}

	public function get_node( $id, $options = array() ) {
		$node = $this->db->get_row( $this->db->prepare( "SELECT * FROM {$this->node_table} WHERE ID = %d", $id ) );
		if ( $node ) {
			return $this->map_node( $node );
		} else {
			throw new Exception( sprintf( __( 'Node %d does not exist', 'wpiab' ), $id ) );
		}
	}

	public function get_children( $id ) {
		$nodes = $this->db->get_results( $this->db->prepare( "SELECT * FROM {$this->node_table} WHERE node_parent = %d ORDER BY node_order, node_title ASC", $id ) );
		if ( $nodes && !is_wp_error( $nodes ) ) {
			$tree_nodes = array();
			foreach ( $nodes as $node ) {
				$tree_nodes[] = $this->map_node( $node );
			}

			return $tree_nodes;
		} elseif ( is_wp_error( $nodes ) ) {
			throw new Exception( sprintf( __( 'WP DB Error', 'wpiab' ), $id ) );
		} else {
			return array();
		}
	}

	protected function map_node( $node, $depth = 1 ) {
		
		$tree_node = new stdClass();
		$child_count = (int)$this->db->get_var( $this->db->prepare( "SELECT COUNT(ID) FROM {$this->node_table} WHERE node_parent = %d", (int) $node->ID ) );
		
		
		$tree_node->children = $child_count > 0 ? true : false;
		$tree_node->id = ((int) $node->ID) === 0 ? '#' : $node->ID;

		$tree_node->text = $node->node_title;
		
		$tree_node->type = $child_count > 0 ? 'default' : 'page';
		
		$tree_node->state = new stdClass();
		$tree_node->state->opened = false;
		$tree_node->state->disabled = false;
		$tree_node->state->selected = false;

		$tree_node->li_attr = '';
		$tree_node->a_attr = '';
		
		

		return $tree_node;
	}

}
