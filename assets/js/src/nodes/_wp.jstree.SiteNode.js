;(function ($, wp) {

    /**
     * Initializes a wp.jsTreeApi endpoint for the specific URL
     * @param wpApiSiteUrl The URL to the site's api root
     * @param model A wp.jsTreeApi.models.Site model, or a generic model with required title and url properties.
     * @constructor
     */
    wp.jstree.SiteNode = function (model, networkApi) {
        this.networkApi = networkApi;
        this.model = model;
        this.collection = null;
        this.attachments = null;

        this.collections = {};

        model.on('change:url', this._onModelChanged, this);


        this._modelsToDelete = new Backbone.Collection();
    };

    wp.jstree.SiteNode.prototype.getSiteId = function () {
        return this.model.get('id');
    };

    wp.jstree.SiteNode.prototype.getApi = function () {
        return this;
    };

    wp.jstree.SiteNode.prototype.getNetworkApi = function () {
        return this.networkApi;
    };

    wp.jstree.SiteNode.prototype._onModelChanged = function () {
        this.collection = null;
    };

    wp.jstree.SiteNode.prototype.fetch = function (parent) {
        if (this.collection === null) {
            return this._initializeAndFetch();
        } else {
            return this._fetch(parent);
        }
    };

    wp.jstree.SiteNode.prototype._initializeAndFetch = function () {
        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        wp.jsTreeApi.init({
            apiRoot: self.model.get('url') + '/wp-json/'
        }).done(function (endpoint) {

            //If we wanted to load more than just pages @ref: https://gist.github.com/lucasstark/03311f1776d1bc027dc53871fe7b7eef as an example
            self.collections = endpoint.get('collections');

            //Create just the Pages endpoint and return the root pages as the initial nodes.
            self.collection = new self.collections.Pages();
            self.attachments = new self.collections.Media();

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
            'status': ['publish', 'draft', 'pending'],
            'context': 'edit',
        };

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


    wp.jstree.SiteNode.prototype.treeCreateNode = function (menu_order) {
        return this._treeCreateNode(0, menu_order);
    };

    wp.jstree.SiteNode.prototype._treeCreateNode = function (parent, menu_order, modelData) {
        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        var data = _.extend({
            title: 'New Page',
            parent: parent || 0,
            menu_order: menu_order || 0,
            status: 'draft',
            migration_notes: '',
            migration_old_url: '',
            migration_content_status: '',
            migration_status: 'new',
        }, modelData);

        console.log(data);

        data.parent = parent;

        self.collection.create(data,
            {
                wait: true,
                success: function (model) {
                    var treeNode = wp.jstree.utils.postTypeToTreeNode(model, self)
                    deferred.resolveWith(self, [treeNode]);
                }
            }
        );


        return promise;
    };

    wp.jstree.SiteNode.prototype.copyTreeNode = function (treeInstance, newParentTreeNode, treeNode, originalTreeNode, destinationParentId, menu_order) {

        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        var sourceSiteApi = originalTreeNode.data.getApi();
        var sourceId = originalTreeNode.data.model.get('id');


        var jsonData = originalTreeNode.data.model.toJSON();
        delete jsonData.id;
        delete jsonData.site_id;

        jsonData.parent = destinationParentId;
        jsonData.menu_order = menu_order;

        this.collection.create(jsonData, {
            wait: true,
            success: function (model) {

                treeNode.data = new wp.jstree.NodeData(model, self);

                self._importChildren(model.get('id'), sourceId, sourceSiteApi).done(function () {
                    deferred.resolveWith(self, [true]);
                });

            }
        });

        return promise;
    };

    wp.jstree.SiteNode.prototype.importTreeNode = function (treeInstance, treeNode, destinationParentId, menu_order) {
        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        var sourceSiteApi = treeNode.data.getApi();
        sourceSiteApi._modelsToDelete = [
            treeNode.data.model
        ];

        this._importItem(treeNode, destinationParentId, menu_order).then(function () {
            treeInstance.refresh_node(treeNode);

            var promises = [];
            for (var i = 0; i < sourceSiteApi._modelsToDelete.length; i++) {
                promises.push(sourceSiteApi._modelsToDelete[i].destroy());
            }

            $.when.apply($, promises).then(function () {
                delete sourceSiteApi._modelsToDelete;
                deferred.resolveWith(self);
            });

        });

        return promise;
    };

    wp.jstree.SiteNode.prototype._importItem = function (treeNode, destinationParentId, menu_order) {
        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        var sourceSiteApi = treeNode.data.getApi();
        var sourceId = treeNode.data.model.get('id');


        var jsonData = treeNode.data.model.toJSON();
        delete jsonData.id;
        delete jsonData.site_id;

        jsonData.parent = destinationParentId;
        jsonData.menu_order = menu_order;

        console.log('Starting Import');
        this.collection.create(jsonData, {
            wait: true,
            success: function (model) {

                treeNode.data = new wp.jstree.NodeData(model, self);

                self._importChildren(model.get('id'), sourceId, sourceSiteApi).done(function () {
                    deferred.resolveWith(self, [true]);
                });

            }
        });

        return promise;
    };

    wp.jstree.SiteNode.prototype._importChildren = function (destinationParentId, sourceParentId, sourceSiteApi) {
        var self = this;

        var queryData = {
            'orderby': 'menu_order',
            'order': 'asc',
            'parent': sourceParentId,
            'per_page': 100,
            'status': ['publish', 'draft', 'pending'],
            'context': 'edit',
        };

        return sourceSiteApi.collection.fetch({
            merge: true, silent: true, add: true, remove: false,
            data: queryData
        }).then(function (results) {
            var promises = [];

            for (var i = 0; i < results.length; i++) {
                var id = results[i].id;
                var jsonData = results[i];

                sourceSiteApi._modelsToDelete.push(sourceSiteApi.collection.get(id));

                delete jsonData.id;
                delete jsonData.site_id;
                delete jsonData.permalink;

                jsonData.parent = destinationParentId;
                if (!jsonData.has_children) {

                    promises.push(self._treeCreateNode(destinationParentId, i, jsonData));

                } else {

                    promises.push(self._treeCreateNode(destinationParentId, i, jsonData).then(function (node) {
                        console.log('Created New Page ' + node.data.model.get('id'))

                        return self._importChildren(node.data.model.get('id'), id, sourceSiteApi);
                    }));

                }
            }

            return $.when.apply($, promises);
        });

    };


    wp.jstree.SiteNode.prototype.fetchAllChildren = function () {
        var self = this;
        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        var collection = new this.collections.Pages();

        this._fetchAllChildren(0, collection).done(function () {
                deferred.resolveWith(self, [collection]);
            }
        );

        return promise;

    };

    wp.jstree.SiteNode.prototype._fetchAllChildren = function (parentId, collection) {
        var self = this;

        var queryData = {
            'orderby': 'menu_order',
            'order': 'asc',
            'parent': parentId || 0,
            'per_page': 100,
            'status': ['publish', 'draft', 'pending'],
            'context': 'edit',
        };

        return collection.fetch({
            merge: true, silent: true, add: true, remove: false,
            data: queryData
        }).then(function (results) {
            var promises = [];

            for (var i = 0; i < results.length; i++) {
                var id = results[i].id;
                var jsonData = results[i];

                if (jsonData.has_children) {
                    promises.push(self._fetchAllChildren(id, collection));
                }
            }

            return $.when.apply($, promises);
        });
    }


})(jQuery, wp);