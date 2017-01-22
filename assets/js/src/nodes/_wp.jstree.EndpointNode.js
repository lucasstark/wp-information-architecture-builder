;(function($, wp) {



    wp.jstree.EndPointNode = function (collection, siteNode) {
        this.siteNode = siteNode;
        this.collection = collection;
    };

    wp.jstree.EndPointNode.prototype.getEndpoint = function () {
        return this;
    };

    wp.jstree.EndPointNode.prototype.getSiteId = function () {
        return this.siteNode.getSiteId();
    };

    wp.jstree.EndPointNode.prototype.fetch = function (parent) {
        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        var queryData = {
            'orderby': 'menu_order',
            'order': 'asc',
            'parent': parent || 0,
            'per_page': 100,
        }

        this.collection.fetch({
            merge: true, silent: true, add: true, remove: false,
            data: queryData
        }).done(function (items) {

            if (self.collection.hasMore()) {
                //TODO:  Determine a better method to handle this situation where there are more than 100 pages.
                alert('This site has more than 100 children at the root.   Consider moving pages into smaller sections.');
            }

            var results = items.map(function (post) {
                var childModel = self.collection.get(post.id);
                return wp.jstree.utils.postTypeToTreeNode(childModel, self);
            });

            deferred.resolveWith(self, [results]);
        });

        return promise;
    };

    /**
     * Creates a new jsTree node object and sets a new wp.jstree.NodeData for use as the data property
     * Note:    Creates and adds a new model to the collection if model arg is empty is empty.
     *
     * @returns {{id: *, text: (*|boolean), children, type: string, icon: (string|*), data: NodeData}}
     */
    wp.jstree.EndPointNode.prototype.treeCreateNode = function (parent, menu_order) {
        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();


        var model = self.collection.create({
                title: 'New Page',
                parent: parent || 0,
                menu_order: menu_order || 0,
                status: 'draft',
                migration_notes: '',
                migration_old_url: '',
                migration_content_status: '',
                migration_status: 'new',
            },
            {
                wait: true,
                success: function (model) {
                    var treeNode = wp.jstree.utils.postTypeToTreeNode(model, self)
                    deferred.resolveWith(self, [treeNode]);
                }
            }
        );


        return promise;
    }

})(jQuery, wp);