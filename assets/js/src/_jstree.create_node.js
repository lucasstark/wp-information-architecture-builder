;(function ($, WPIAB) {

    WPIAB.create_node = function (e, treeNodeData) {
        var parentNode;
        if (treeNodeData.node.type === 'site') {
            parentNode = treeNodeData.instance.get_node(treeNodeData.node.parent);

            var siteModel = new rootData.models.Sites({
                title: treeNodeData.node.text,
                domain: wp_iab_params.domain,
            });

            rootData.sitesCollection.add(siteModel);

            treeNodeData.node.data = {
                model: siteModel
            };

            treeNodeData.instance.deselect_all();
            treeNodeData.instance.select_node(treeNodeData.node);

        } else {
            //Get the parent tree view node.
            parentNode = treeNodeData.instance.get_node(treeNodeData.node.parent);

            //Reference to the site id.
            var siteTreeNode = WPIAB.getSiteTreeNode(treeNodeData.node);

            //If parent type is site post_parent will be 0, otherwise get the ID of the parent Page Model
            var parent_wp_id = parentNode.type === 'site' ? 0 : parentNode.data.model.id;

            var page_model = new siteTreeNode.data.api.models.Page({
                title: {
                    raw: treeNodeData.node.text,
                    rendered: treeNodeData.node.text
                },
                status: 'publish',
                parent: parent_wp_id,
                link: '',
                menu_order: parentNode.children.length + 1,
                migration_notes: '',
                migration_old_url: '',
                migration_content_status: '',
                migration_status: 'new',
            });

            //Add the new Page Model to the collection, but do not save it.
            //If we saved it here it would have the slug including 'Untitled'
            siteTreeNode.data.pages.add(page_model);

            //Add the Page Model reference to the tree node.
            treeNodeData.node.data = {
                model: page_model,
            };

            treeNodeData.instance.deselect_all();
            treeNodeData.instance.select_node(treeNodeData.node);
        }
    };
})(jQuery, WPIAB);