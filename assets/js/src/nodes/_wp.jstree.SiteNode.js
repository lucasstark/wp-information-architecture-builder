;(function ($, wp) {

    /**
     * Initializes a wp.api endpoint for the specific URL
     * @param wpApiSiteUrl The URL to the site's api root
     * @param model A wp.api.models.Site model, or a generic model with required title and url properties.
     * @constructor
     */
    wp.jstree.SiteNode = function (model) {
        this.model = model;
        this.collection = null;
        this.wpApiSiteUrl = this.model.get('url') + '/wp-json/';
    };

    wp.jstree.SiteNode.prototype.getApi = function(){
        return this;
    };

    wp.jstree.SiteNode.prototype.fetch = function () {
        if (this.collection === null) {
            return this._initializeAndFetch();
        } else {
            return this._fetch();
        }
    }

    wp.jstree.SiteNode.prototype._initializeAndFetch = function () {
        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        wp.api.init({
            apiRoot: this.wpApiSiteUrl
        }).done(function (endpoint) {

            //Create just the Pages endpoint and return the root pages as the initial nodes.
            //If we wanted to load more than just pages @ref: https://gist.github.com/lucasstark/03311f1776d1bc027dc53871fe7b7eef as an example
            var collections = endpoint.get('collections');
            self.collection = new collections.Pages();
            self._fetch(0).done(function (results) {
                deferred.resolveWith(self, [results]);
            });
        });

        return promise;
    };

    wp.jstree.SiteNode.prototype._fetch = function (parent) {
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

    wp.jstree.SiteNode.prototype.getSiteId = function () {
        return this.model.get('id');
    };

    wp.jstree.SiteNode.prototype.treeCreateNode = function (menu_order) {
        //Delegate back down to the Pages endpoint node data object.
        //If we wanted to load more than just Pages for the site this needs to be updated.
        return this.endpoints['Pages'].treeCreateNode(0, menu_order);
    }

    wp.jstree.SiteNode.prototype.importItem = function( itemNode, menu_order ) {
        var jsonData = itemNode.model.toJSON();
        delete jsonData.id;
        delete jsonData.site_id;

        this.collection.create(jsonData, {
            success : function() {
                itemNode.model.destroy();
            }
        });
    }


})(jQuery, wp);