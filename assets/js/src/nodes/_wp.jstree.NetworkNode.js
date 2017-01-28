;(function ($, wp) {

    /**
     * Represents the node for the whole WP network.
     * @param networkId
     * @constructor
     */
    wp.jstree.NetworkNode = function (networkId) {
        this.collection = null;
        this.networkId = networkId;
    };

    /**
     * Fetch all of the sites and create SiteNodes.  Fetch resolves with jsTree nodes are as the root elements for the jsTree.
     */
    wp.jstree.NetworkNode.prototype.fetch = function () {

        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        wp.api.init({
            apiRoot: wp_iab_params.api_url
        }).done(function (endpoint) {

            var collections = endpoint.get('collections');
            self.collection = new collections.Sites();

            self.collection.fetch().done(function (results) {

                var childNodes = results.map(function (result) {
                    var model = self.collection.get(result.id);
                    return {
                        id: 'network-' + self.networkId + '-site-' + model.get('id'),
                        text: wp.jstree.utils.getNodeTitle(model),
                        children: true,
                        type: 'site',
                        data: new wp.jstree.SiteNode(model, self)
                    }
                });

                var node = {
                    id: 'root',
                    type: 'network',
                    text: wp_iab_params.labels.root_node_text,
                    children: childNodes,
                    data: self,
                    state: {
                        'opened': true,
                        'selected': false,
                        'disabled': false
                    },
                }


                deferred.resolveWith(self, [node]);
            });
        });

        return promise;

    };


    wp.jstree.NetworkNode.prototype.createSite = function (title) {
        var model = new this.collection.model({
            title: title,
            domain: wp_iab_params.domain,
        });

        this.collection.add(model);
        return model;
    };

    wp.jstree.NetworkNode.prototype.treeCreateNode = function (title) {
        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();


        self.collection.create({
                title: title,
                domain: wp_iab_params.domain,
            },
            {
                wait: true,
                success: function (model) {
                    var treeNode = {
                        id: 'network-' + self.networkId + '-site-' + model.get('id'),
                        text: wp.jstree.utils.getNodeTitle(model),
                        children: true,
                        type: 'site',
                        data: new wp.jstree.SiteNode(model, self)
                    }
                    deferred.resolveWith(self, [treeNode]);
                }
            }
        );

        return promise;
    };


})(jQuery, wp);