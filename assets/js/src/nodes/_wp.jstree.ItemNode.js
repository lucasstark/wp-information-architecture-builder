;(function($, wp) {

    /**
     * Data object for individual items in the jsTree.
     * @param model
     * @param endpointNode
     * @constructor
     */
    wp.jstree.NodeData = function (model, api) {
        this.model = model;
        this.api = api;
    };

    wp.jstree.NodeData.prototype.getApi = function(){
        return this.api;
    }

    wp.jstree.NodeData.prototype.getSiteId = function () {
        return this.api.model.get('id')
    };

    /**
     * Delegates to the endpoint fetch method.
     */
    wp.jstree.NodeData.prototype.fetch = function () {
        return this.api.fetch(this.model.get('id'));
    };

    /**
     * Delegates to the api treeCreateNode
     * @param menu_order
     * @returns {{id: *, text: (*|boolean), children, type: string, icon: (string|*), data: NodeData}}
     */
    wp.jstree.NodeData.prototype.treeCreateNode = function (menu_order) {
        return this.api._treeCreateNode(this.model.get('id'), menu_order || 0);
    }

    wp.jstree.NodeData.prototype.importItem = function (itemNode, menu_order) {
        return this.api._importItem(itemNode, this.model.get('id'), menu_order);
    }

})(jQuery, wp);