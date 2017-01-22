;(function($, wp) {

    /**
     * Initializes a wp.api endpoint for the specific URL
     * @param wpApiSiteUrl The URL to the site's api root
     * @param model A wp.api.models.Site model, or a generic model with required title and url properties.
     * @constructor
     */
    wp.jstree.SiteNode = function (model) {
        this.model = model;
        this.wpApiSiteUrl = this.model.get('url') + '/wp-json/';
        this.endpoints = {};
    };

    wp.jstree.SiteNode.prototype.getEndpoint = function (endPointName) {
        return this.endpoints[endPointName || 'Pages'];
    };


    wp.jstree.SiteNode.prototype.fetch = function () {
        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        wp.api.init({
            apiRoot: this.wpApiSiteUrl
        }).done(function (endpoint) {

            //Create just the Pages endpoint and return the root pages as the initial nodes.
            //If we wanted to load more than just pages @ref: https://gist.github.com/lucasstark/03311f1776d1bc027dc53871fe7b7eef as an example
            var collections = endpoint.get('collections');
            self.endpoints['Pages'] = new wp.jstree.EndPointNode(new collections.Pages(), self);
            self.endpoints['Pages'].fetch().done(function (results) {
                deferred.resolveWith(self, [results]);
            });
        });

        return promise;

    };

    wp.jstree.SiteNode.prototype.getSiteId = function () {
        return this.model.get('id');
    };

    wp.jstree.SiteNode.prototype.treeCreateNode = function (menu_order) {
        //Delegate back down to the Pages endpoint node data object.
        //If we wanted to load more than just Pages for the site this needs to be updated.
        return this.endpoints['Pages'].treeCreateNode(0, menu_order);
    }

})(jQuery, wp);