;(function($, wp){
    /**
     * Create a jsTree node from a wpApiBaseModel
     * @param model wp.api.wpApiBaseModel
     * @param endpointNode  wp.jstree.EndPointNodeData
     * @returns {{id: *, text: (*|boolean), children, type: string, icon: (string|*), data: NodeData}}
     */
    wp.jstree.utils.postTypeToTreeNode = function (model, endpointNode) {
        return {
            text: wp.jstree.utils.getNodeTitle(model),
            children: model.get('has_children'),
            type: 'post-type-' + model.get('type'),
            icon: wp.jstree.utils.getNodeIcon(model),
            data: new wp.jstree.NodeData(model, endpointNode)
        }
    };

    /**
     * Gets a unique DOM id for the model
     * @param model A node data object, either node, endpoint or site.
     * @returns {string}
     */
    wp.jstree.utils.getNodeDomId = function (nodeData) {
        nodeData = nodeData.data || nodeData;
        return 'collection-' + nodeData.getSiteId() + '-item-' + nodeData.model.get('id');
    };

    /**
     * Helper to grab the title from a model
     * @param model
     * @returns {*|boolean}
     */
    wp.jstree.utils.getNodeTitle = function (model) {
        if (model.get('title').rendered !== undefined) {
            return model.get('title').rendered
        } else {
            return model.get('title');
        }
    }

    /**
     * Helper to get the css classes for a models tree node.
     * @param model
     * @returns {string}
     */
    wp.jstree.utils.getNodeIcon = function (model) {
        var icon = 'glyph-icon fa ' + (model.get('has_children') ? 'fa-folder' : 'fa-file');
        var iconColor = '';

        switch (model.get('migration_status')) {
            case 'new':
                iconColor = 'font-new';
                break;
            case 'in_progress' :
                iconColor = 'font-in-progress';
                break;
            case 'in_review' :
                iconColor = 'font-in-review';
                break;
            case 'complete' :
                iconColor = 'font-complete';
                break;
            default :
                iconColor = 'font-new';
                break;
        }

        return icon + ' ' + iconColor;

    }
}(jQuery, wp))