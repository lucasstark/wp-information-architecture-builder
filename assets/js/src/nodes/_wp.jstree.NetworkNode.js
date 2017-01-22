;(function ($, wp) {

    /**
     * Represents the node for the whole WP network.
     * @param networkId
     * @constructor
     */
    wp.jstree.NetworkNode = function (networkId) {
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
            var sites = new collections.Sites();

            sites.fetch().done(function (results) {

                var childNodes = results.map(function (result) {
                    var model = sites.get(result.id);
                    return {
                        id: 'network-' + self.networkId + '-site-' + model.get('id'),
                        text: wp.jstree.utils.getNodeTitle(model),
                        children: true,
                        type: 'site',
                        data: new wp.jstree.SiteNode(model)
                    }
                });

                var node = {
                    id: 'root',
                    type: 'network',
                    text: wp_iab_params.root_node_text,
                    children: childNodes,
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


})(jQuery, wp);