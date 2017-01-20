;(function ($, WPIAB) {
    WPIAB.rename_node = function (e, treeNodeData) {

        var domNode = $('#' + treeNodeData.node.id);

        if (treeNodeData.node.type === 'site') {
            treeNodeData.node.data.model.set('title', treeNodeData.node.text);
            treeNodeData.node.data.model.set('slug', ''); //empty slug so the server will generate it for us.
            WPIAB.setLoading(true, domNode);
            treeNodeData.node.data.model.save().done(function () {

                treeNodeData.node.children = true;
                treeNodeData.instance.refresh(treeNodeData.node);

                if (!treeNodeData.node.data.api) {
                    wp.api.init({
                        apiRoot: treeNodeData.node.data.model.get('url') + '/wp-json/'
                    }).done(function () {

                        treeNodeData.node.data.api = {
                            models: {},
                            collections: {}
                        };

                        treeNodeData.node.data.api.models = _.extend({}, this.models);
                        treeNodeData.node.data.api.collections = _.extend({}, this.collections);
                        treeNodeData.node.data.pages = new treeNodeData.node.data.api.collections.Pages();
                        WPIAB.setLoading(false, domNode);
                    });
                }
            });

        } else {
            if (treeNodeData.node.data.model.get('title') !== treeNodeData.node.text) {
                treeNodeData.node.data.model.set('title', {
                    raw: treeNodeData.node.text,
                    rendered: treeNodeData.node.text
                });

                WPIAB.setLoading(true, domNode);
                treeNodeData.node.data.model.save().done(function () {
                    WPIAB.App.switchView(treeNodeData.node.data.model, treeNodeData.node);
                    WPIAB.setLoading(false, domNode);
                });

            }
        }
    };
})(jQuery, WPIAB);