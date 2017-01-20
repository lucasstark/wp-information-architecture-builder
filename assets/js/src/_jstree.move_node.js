;(function($, WPIAB){
    WPIAB.move_node = function (e, data) {
        //parent node is the new parent in jsTree.
        data.instance.deselect_all();
        var parentNode = data.instance.get_node(data.node.parent);
        var parentDomNode = data.instance.get_node(data.node.parent, true);
        var siteNode = WPIAB.getSiteTreeNode(parentNode);


        WPIAB.setLoading(true, parentDomNode);

        var parent_wp_id = 0;

        //if the parent is site, the wp parent id needs to remian 0
        if (parentNode.type !== 'site') {
            parent_wp_id = parentNode.data.model.id;
        }

        //Reset the icon to a folder, since we know for sure that it has children now.
        data.instance.set_icon(parent, 'glyph-icon fa fa-folder font-blue');

        var activeCalls = parentNode.children.length - data.position;

        var doneFunction = function (result) {
            //Remove the spinner from this specific item.
            $('#' + siteNode.data.model.id + '-item-' + result.id).removeClass('jstree-loading').attr('aria-busy', false);

            activeCalls--;
            if (activeCalls === 0) {
                data.instance.get_node(data.node.parent, true).removeClass("jstree-loading").attr('aria-busy', false);
                WPIAB.setLoading(false);
                WPIAB.App.switchView(data.node.data.model, data.node);
            }
        };

        for (var i = 0; i < parentNode.children.length; i++) {
            if (i >= data.position) {
                var child = data.instance.get_node(parentNode.children[i]);

                child.data.model.set('parent', parent_wp_id);
                child.data.model.set('menu_order', i);

                //Set the spinner on the individual item
                $('#' + siteNode.data.model.id + '-item-' + child.data.model.id).addClass('jstree-loading').attr('aria-busy', true);

                child.data.model.save().done(doneFunction);

            }
        }
    };
})(jQuery, WPIAB);
