/*! 
 * 
 * Copyright (c) 2017;
 * Licensed GPLv2+
 */
;(function($, wp){

    wp.jstree = wp.jstree || {};
    wp.jstree.utils = wp.jstree.utils || {};
    wp.jstree.ui = wp.jstree.ui || {};
    wp.jstree.views = wp.jstree.views || {};


})(jQuery, wp);
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
;(function ($, wp) {

    //TODO:  Move this into the main AppView

    /**
     * Toggle loading state for the treeNode spinner and other views.
     * @param loading
     * @param domNode
     */
    wp.jstree.ui.setLoading = function (loading, domNode) {
        if (loading) {
            if (domNode) {
                domNode.addClass("jstree-loading").attr('aria-busy', true);
            }

            $('.loading-icon').removeClass('fa-circle-o').addClass('fa-circle-o-notch fa-spin').attr('aria-busy', true);

            $('.network_browser_tree').block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });

            //App.siteInfoPane.block();

        } else {
            if (domNode) {
                domNode.removeClass("jstree-loading").attr('aria-busy', false);
            }
            //App.siteInfoPane.unblock();

            $('.network_browser_tree').unblock();
            $('.loading-icon').removeClass('fa-circle-o-notch fa-spin').addClass('fa-circle-o').attr('aria-busy', false);
        }
    }

})(jQuery, wp)
;(function($, wp) {

    /**
     * Data object for individual items in the jsTree.
     * @param model
     * @param endpointNode
     * @constructor
     */
    wp.jstree.NodeData = function (model, endpointNode) {
        this.model = model;
        this.endpointNode = endpointNode;
    };

    wp.jstree.NodeData.prototype.getEndpoint = function () {
        return this.endpointNode;
    };

    wp.jstree.NodeData.prototype.getSiteId = function () {
        return this.endpointNode.getSiteId();
    };

    /**
     * Delegates to the endpoint fetch method.
     */
    wp.jstree.NodeData.prototype.fetch = function () {
        return this.endpointNode.fetch(this.model.get('id'));
    };

    /**
     * Delegates to the endpoint treeCreateNode
     * @param menu_order
     * @returns {{id: *, text: (*|boolean), children, type: string, icon: (string|*), data: NodeData}}
     */
    wp.jstree.NodeData.prototype.treeCreateNode = function (menu_order) {
        return this.endpointNode.treeCreateNode(this.model.get('id'), menu_order || 0);
    }

})(jQuery, wp);
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
;(function($, wp){

    /**
     * The view for each page.  Has the title and other fields.
     */
    wp.jstree.views.ItemView = Backbone.View.extend({
        treeNode: {},
        //Template is in views/index.php
        template: _.template($('#info-pane-template').html()),
        events: {
            "click .btn-save": "onSave",
            "click .btn-delete": "onDelete",
            "click .btn-cancel": 'onCancel',
            "change #migration-status": 'saveModel',
            'focusout .title': 'saveModel',
            'focusout #migration-notes': 'saveModel',
            'focusout #migration-old-url': 'saveModel'
        },
        initialize: function (options) {
            this.$content = this.$el.find('#info-pane');

            _.bindAll(this, 'onSave', 'onDelete', 'onCancel', 'updateModel', 'saveModel');
        },
        empty: function () {
            this.$content.empty();
        },
        switchNode: function (treeNode) {

            this.model = treeNode.data.model;
            this.treeNode = treeNode;
            this.empty();

            this.$content.html(this.template(this.model.attributes));
            this.$content.find('input.title').eq(0).focus(function () {
                $(this).select()
            });
        },
        onSave: function (e) {
            e.preventDefault();
            this.saveModel();
        },
        onDelete: function (e) {
            e.preventDefault();
        },
        onCancel: function (e) {
            e.preventDefault();
        },
        //Updates the model properties but does not sync it with the server.
        updateModel: function () {
            var updateRequired = false;

            var endpoint = this.treeNode.data.getEndpoint();
            var siteModel = endpoint.siteNode.model;

            var migration_status_previous = this.model.get('migration_status');

            var title = this.$el.find('input.title').eq(0).val();
            if (title !== this.model.get('title').rendered) {
                updateRequired = true;
                this.model.set('title', {
                    raw: title,
                    rendered: title
                });
            }

            var migration_notes = this.$el.find('#migration-notes').eq(0).val();
            if (this.model.get('migration_notes') !== migration_notes) {
                updateRequired = true;
                this.model.set('migration_notes', migration_notes);
            }


            var migration_old_url = this.$el.find('#migration-old-url').eq(0).val();
            if (this.model.get('migration_old_url') !== migration_old_url) {
                updateRequired = true;
                this.model.set('migration_old_url', migration_old_url);
            }

            //TODO:  Find a better way to keep this state in sync.
            var migration_status = this.$el.find('#migration-status').eq(0).val();
            if (migration_status_previous !== migration_status) {
                updateRequired = true;
                var migrationStatusCountPrevious = siteModel.get('migration_status_' + migration_status_previous);
                var migrationStatusCount = siteModel.get('migration_status_' + migration_status);
                this.model.set('migration_status', migration_status);
                siteModel.set('migration_status_' + migration_status, migrationStatusCount + 1);
                siteModel.set('migration_status_' + migration_status_previous, migrationStatusCountPrevious - 1);
            }

            return updateRequired;
        },
        //Save the model to the server, triggers the loading animations.
        saveModel: function () {
            var updateRequired = this.updateModel();
            if (updateRequired) {
                var self = this;

                var inst = $.jstree.reference(this.treeNode);
                var domNode = inst.get_node(this.treeNode, true);

                wp.jstree.ui.setLoading(true, domNode);
                this.block();

                this.model.save().done(function () {
                    inst.set_text(self.treeNode, self.model.get('title').rendered);
                    inst.set_icon(self.treeNode, wp.jstree.utils.getNodeIcon(self.model));

                    wp.jstree.ui.setLoading(false, domNode);
                    self.unblock();
                });
            }
        },
        //From blockui
        block: function () {
            this.$el.block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });
        },
        //From blockui
        unblock: function () {
            this.$el.unblock();
        }
    });


})(jQuery, wp);
;(function($, wp){
    //Contains the chart for the site information.
    wp.jstree.views.SiteView = Backbone.View.extend({
        //Template is in views/index.php
        template: _.template($('#site-info-pane-template').html()),
        initialize: function () {
            _.bindAll(this, "render", 'addPage', 'removePage');
            this.$plot = this.$el.find('.site-info-plot').eq(0);
            this.$content = this.$el.find('.site-info-content').eq(0);
            console.log(this.$el.html())

        },
        switchNode: function (treeNode) {

            if (this.model) {
                this.stopListening(this.model);
            }

            if (this.collection) {
                this.stopListening(this.collection);
            }

            var endpoint = treeNode.data.getEndpoint();
            this.model = endpoint.siteNode.model;
            this.collection = endpoint.collection;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.collection, 'add', this.addPage);
            this.listenTo(this.collection, 'remove', this.removePage);
            this.render(this.model);
        },
        //Renders the pie chart.
        render: function (model) {
            //Get's called when any of the models properties change and when an item is added or removed from the pages collection.

            this.block();

            //this.$content.empty();
            //this.$content.html(this.template(this.model.toJSON()));

            var data = [
                {
                    label: wp_iab_params.labels.migration_status_new,
                    data: this.model.get('migration_status_new'),
                    color: '#0073aa'
                },
                {
                    label: wp_iab_params.labels.migration_status_in_progress,
                    data: this.model.get('migration_status_in_progress'),
                    color: '#23282d'
                },
                {
                    label: wp_iab_params.labels.migration_status_in_review,
                    data: this.model.get('migration_status_in_review'),
                    color: '#984DFF'
                },
                {
                    label: wp_iab_params.labels.migration_status_complete,
                    data: this.model.get('migration_status_complete'),
                    color: '#12aa1b'
                },
            ];

            //Plot is defined in flot.js
            this.$plot.unbind();
            $.plot(this.$plot, data, {
                series: {
                    pie: {
                        show: true,
                        radius: 1,
                        label: {
                            show: true,
                            radius: 3 / 4,
                            formatter: this.labelFormatter,
                            background: {
                                opacity: 0.5
                            }
                        }
                    }
                }
            });
            this.unblock();
        },
        labelFormatter: function (label, series) {
            return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
        },
        block: function () {
            this.$el.block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });
        },
        unblock: function () {
            this.$el.unblock();
        },
        addPage: function (pageModel) {
            //When an item is added to the sites pages collection.
            //Update the status counts on this views model, which is a Site model.
            var count = this.model.get('migration_status_' + pageModel.get('migration_status'));
            this.model.set('migration_status_' + pageModel.get('migration_status'), count + 1);
        },
        removePage: function (pageModel) {
            //When an item is removed from the sites pages collection.
            //Update the status counts on this views model, which is a Site model.
            var count = this.model.get('migration_status_' + pageModel.get('migration_status'));
            this.model.set('migration_status_' + pageModel.get('migration_status'), count - 1);
        }
    });
    
})(jQuery, wp);
(function ($, wp) {
    //Main Application Screen
    $.jstree.defaults.core.themes.variant = "large";
    $.jstree.defaults.core.themes.stripes = true;

    wp.jstree.views.ApplicationView = Backbone.View.extend({
        initialize: function () {
            var self = this;

            this.itemView = new wp.jstree.views.ItemView({
                el: self.$el.find('#info-container')
            });

            this.siteView = new wp.jstree.views.SiteView({
                    el: self.$el.find('#site-info-container')
            });

            this.$tree = self.$el.find('#network_browser_tree');

            _.bindAll(this, 'switchNode');
        },
        switchNode: function (treeNode) {
            this.siteView.switchNode(treeNode);
            if (treeNode.type !== 'site') {
                this.itemView.switchNode(treeNode)
            }
        },
        render: function () {
            var view = this;

            //Show the loading animation on the network tree view while it's loading for the first time.

            view.$el.find('.network_browser_tree_container').block({
                message: null,
                overlayCSS: {
                    background: '#000',
                    opacity: 0.2
                }
            });

            wp.jstree.ui.setLoading(true);

            this.$tree.jstree({
                'types': {
                    'default': {},
                    'page': {
                        'valid_children': ['page', 'post-type-page']
                    },
                    'post-type-page': {
                        'valid_children': ['page', 'post-type-page']
                    },
                    'endpoint': {
                        'icon': "glyph-icon fa fa-globe font-green",
                        'valid_children': ['page']
                    },
                    'site': {
                        'icon': "glyph-icon fa fa-globe font-green",
                        'valid_children': ['endpoint', 'post-type-page', 'page', 'default']
                    },
                    'network': {
                        'icon': "glyph-icon fa fa-globe font-green",
                        'valid_children': ['site']
                    }
                },
                "plugins": [
                    "types", "contextmenu", "dnd",
                ],
                'dnd': {
                    //Disallow dragging of sites since there isn't an order to the sites in a multisite.
                    'is_draggable': function (nodes) {
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].type === 'site') {
                                return false;
                            }
                        }

                        return true;
                    }
                },
                'contextmenu': {
                    'items': function (node) {
                        var tmp = $.jstree.defaults.contextmenu.items();
                        delete tmp.create.action;

                        //If the id is root, it's the "Sites" top level node.  Set the context menu to allow creating a new site.
                        if (node.id === 'root') {
                            tmp.create.label = wp_iab_params.labels.new_site;
                            tmp.create.separator_after = false;
                            tmp.create.separator_before = false;
                            tmp.create.action = function (data) {
                                var treeInstance = $.jstree.reference(data.reference);
                                var obj = inst.get_node(data.reference);

                                treeInstance.create_node(obj, {
                                        type: 'site',
                                        text: wp_iab_params.labels.new_site,
                                    },

                                    'last', function (new_node) {
                                        setTimeout(function () {
                                            inst.edit(new_node);
                                        }, 0);
                                    });
                            };

                            //Remove other actions since create site is the only allowed operation.
                            delete tmp.ccp;
                            delete tmp.rename;
                            delete tmp.remove;
                        } else {
                            delete tmp.ccp;
                            //Context menu for any page.
                            //Reset the create action to create a new tree node and then call the edit function.
                            tmp.create.label = wp_iab_params.labels.newItem;
                            tmp.create.action = function (data) {
                                var treeInstance = $.jstree.reference(data.reference);
                                var parentTreeNode = treeInstance.get_node(data.reference);

                                parentTreeNode.data.treeCreateNode(parentTreeNode.data.model.get('id'), parentTreeNode.children.length).done(function (newTreeNode) {
                                    treeInstance.create_node(parentTreeNode, newTreeNode,
                                        'last', function (new_node) {
                                            setTimeout(function () {
                                                treeInstance.edit(new_node);
                                            }, 0);
                                        });
                                });
                            };

                            //Reset the remove action to delete the page model.
                            tmp.remove.action = function (data) {
                                var inst = $.jstree.reference(data.reference)
                                var nodeToDelete = inst.get_node(data.reference);
                                var domNodeToDelete = inst.get_node(data.reference, true);

                                wp.jstree.ui.setLoading(true, domNodeToDelete);
                                nodeToDelete.data.model.destroy().done(function () {
                                    setTimeout(function () {
                                        inst.delete_node(nodeToDelete);
                                        wp.jstree.ui.setLoading(false, domNodeToDelete);
                                    }, 0);
                                });

                            }
                        }

                        return tmp;
                    }
                },
                'core': {
                    'multiple': false,
                    'check_callback': function (operation, node, node_parent, node_position, more) {
                        //TODO:  Allow dragging / copying between sites. Currently moving between sites is disabled.
                        if (operation === 'move_node') {

                            if (node_parent.type === 'root') {
                                return false;
                            }

                            return node.data.getSiteId() === node_parent.data.getSiteId();
                        }

                        return true;
                    },
                    'data': function (node, cb) {
                        var treeInstance = this;

                        //This is the root node from jstree.
                        if (node.id === '#') {

                            treeInstance.networkNode = new wp.jstree.NetworkNode(1);
                            treeInstance.networkNode.fetch().done(function (result) {
                                cb.call(treeInstance, result);
                            });

                        } else {

                            //node.data is either an instance of wp.jstree.SiteNodeData, wp.jstree.EndPointData, wp.jstree.NodeData
                            node.data.fetch().done(function (results) {
                                cb.call(treeInstance, results);
                            });


                        }
                    }
                }
            })
                .on('loading_node.jstree', function (e, treeNodeData) {
                    if (treeNodeData.node.type === 'site') {
                        //view.switchNode(treeNodeData.node);
                    }
                    wp.jstree.ui.setLoading(true);
                })
                .on('load_node.jstree', function (e, treeNodeData) {
                    wp.jstree.ui.setLoading(false);
                })
                .on('loaded.jstree', function (e, treeNodeData) {
                    wp.jstree.ui.setLoading(false);
                })
                .on('create_node.jstree', function (e, treeNodeData) {

                    if (treeNodeData.node.type === 'site') {

                        var siteModel = new view.collection.model({
                            title: treeNodeData.node.text,
                            domain: wp_iab_params.domain,
                        });

                        this.collection.add(siteModel);

                        treeNodeData.node.data = {
                            model: siteModel
                        };

                        treeNodeData.instance.deselect_all();
                        treeNodeData.instance.select_node(treeNodeData.node)

                    } else {
                        treeNodeData.instance.deselect_all();
                        treeNodeData.instance.select_node(treeNodeData.node)
                    }

                })
                .on('rename_node.jstree', function (e, treeNodeData) {

                    var domNode = $('#' + treeNodeData.node.id);

                    if (treeNodeData.node.type === 'site') {
                        treeNodeData.node.data.model.set('title', treeNodeData.node.text);
                        treeNodeData.node.data.model.set('slug', ''); //empty slug so the server will generate it for us.

                        wp.jstree.ui.setLoading(true, domNode);

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
                                    wp.jstree.ui.setLoading(false, domNode);
                                });
                            }
                        });

                    } else {
                        if (treeNodeData.node.data.model.get('title') !== treeNodeData.node.text) {
                            treeNodeData.node.data.model.set('title', {
                                raw: treeNodeData.node.text,
                                rendered: treeNodeData.node.text
                            });

                            //TODO:  Add options for default new item status
                            treeNodeData.node.data.model.set('status', 'publish');

                            wp.jstree.ui.setLoading(true, domNode);
                            treeNodeData.node.data.model.save().done(function () {
                                view.switchNode(treeNodeData.node);
                                wp.jstree.ui.setLoading(false, domNode);
                            })

                        }
                    }
                })
                .on('move_node.jstree', function (e, treeNodeData) {

                    //parent node is the new parent in jsTree.
                    treeNodeData.instance.deselect_all();
                    var parentNode = treeNodeData.instance.get_node(treeNodeData.node.parent);
                    var parentDomNode = treeNodeData.instance.get_node(treeNodeData.node.parent, true);

                    wp.jstree.ui.setLoading(true, parentDomNode);

                    var parent_wp_id = 0;

                    //if the parent is site, the wp parent id needs to remian 0
                    if (parentNode.type !== 'site') {
                        parent_wp_id = parentNode.data.model.get('id');
                    }

                    //Reset the icon to a folder, since we know for sure that it has children now.
                    treeNodeData.instance.set_icon(parent, 'glyph-icon fa fa-folder font-blue');

                    var activeCalls = parentNode.children.length - treeNodeData.position;

                    for (var i = 0; i < parentNode.children.length; i++) {
                        if (i >= treeNodeData.position) {
                            //The child jsTree node object
                            var child = treeNodeData.instance.get_node(parentNode.children[i]);

                            //The child jsTree node dom object
                            var childDomNode = treeNodeData.instance.get_node(parentNode.children[i], true);

                            //Set the spinner on the individual item
                            childDomNode.addClass('jstree-loading').attr('aria-busy', true);

                            child.data.model.save({
                                'parent': parent_wp_id,
                                'menu_order': i,
                            }, {
                                context: childDomNode,
                                success: function (model) {
                                    // this is the jQuery dom node, passed in as the context parameter to the save options.
                                    //Remove the spinner from this specific item.
                                    this.removeClass('jstree-loading').attr('aria-busy', false);
                                }
                            }).done(function (result) {

                                activeCalls--;
                                if (activeCalls === 0) {
                                    treeNodeData.instance.get_node(treeNodeData.node.parent, true).removeClass("jstree-loading").attr('aria-busy', false);
                                    wp.jstree.ui.setLoading(false);
                                    view.switchNode(treeNodeData.node);
                                }
                            });

                        }
                    }
                })
                .on('changed.jstree', function (e, treeNodeData) {

                    if (treeNodeData && treeNodeData.selected && treeNodeData.selected.length === 1 && treeNodeData.node.type !== 'network') {
                        view.switchNode(treeNodeData.node);
                    }


                })
                .on('ready.jstree', function (e) {
                    wp.jstree.ui.setLoading(false);
                    view.$el.find('.network_browser_tree_container').unblock();
                });
        }
    });


    //Initialize the tree and hook up all the actions.


    $(document).ready(function () {
        function setHeight() {
            windowHeight = $(window).innerHeight();
            $('.network_browser_tree_container').css('height', windowHeight - 200);
            $('.wrap').css('height', windowHeight);
        };
        setHeight();

        $(window).resize(function () {
            setHeight();
        });

        var application = new wp.jstree.views.ApplicationView({
            el: '#application_root'
        });

        application.render();
    });

}(jQuery, wp));
