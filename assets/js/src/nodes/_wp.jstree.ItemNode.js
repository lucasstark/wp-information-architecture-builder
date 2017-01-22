;(function($, wp) {

    /**
     * Data object for individual items in the jsTree.
     * @param model
     * @param endpointNode
     * @constructor
     */
    wp.jstree.NodeData = function (model, endpointNode) {
        this.model = model;
        this.endpointNode = endpointNode;
    };

    wp.jstree.NodeData.prototype.getEndpoint = function () {
        return this.endpointNode;
    };

    wp.jstree.NodeData.prototype.getSiteId = function () {
        return this.endpointNode.getSiteId();
    };

    /**
     * Delegates to the endpoint fetch method.
     */
    wp.jstree.NodeData.prototype.fetch = function () {
        return this.endpointNode.fetch(this.model.get('id'));
    };

    /**
     * Delegates to the endpoint treeCreateNode
     * @param menu_order
     * @returns {{id: *, text: (*|boolean), children, type: string, icon: (string|*), data: NodeData}}
     */
    wp.jstree.NodeData.prototype.treeCreateNode = function (menu_order) {
        return this.endpointNode.treeCreateNode(this.model.get('id'), menu_order || 0);
    }

})(jQuery, wp);