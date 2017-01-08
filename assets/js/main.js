(function ($) {

    /**
     * The view for each page.  Has the title and other fields.
     */
    var InfoPaneView = Backbone.View.extend({
        treeNode: {},
        //Template is in views/index.php
        template: _.template($('#info-pane-template').html()),
        el: $('#info-pane'),
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
            _.bindAll(this, 'onSave', 'onDelete', 'onCancel', 'updateModel', 'saveModel');
        },
        empty: function () {
            this.$el.empty();
        },
        render: function (model, treeNode) {
            console.log(model);

            this.model = model;
            this.treeNode = treeNode;
            this.empty();

            this.$el.html(this.template(this.model.attributes));
            this.$el.find('input.title').eq(0).focus(function () {
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

            var siteTreeNode = getSiteTreeNode(this.treeNode);
            var siteModel = siteTreeNode.data.model;
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

                setLoading(true, domNode);
                this.block();

                this.model.save().done(function () {
                    inst.set_text(self.treeNode, self.model.get('title').rendered);
                    inst.set_icon(self.treeNode, getNodeIcon(self.model));

                    setLoading(false, domNode);
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

    //Contains the chart for the site information.
    var SiteInfoPaneView = Backbone.View.extend({
        //Template is in views/index.php
        template: _.template($('#site-info-pane-template').html()),
        el: $('#site-info-pane'),
        initialize: function () {
            _.bindAll(this, "render", 'addPage', 'removePage');
            this.$plot = this.$el.find('.site-info-plot').eq(0);
            this.$content = this.$el.find('.site-info-content').eq(0);



        },
        switchModels : function(model, collection, siteTreeNode) {
            this.siteTreeNode = siteTreeNode;

            if (this.model) {
                this.stopListening(this.model);
            }

            if (this.collection) {
                this.stopListening(this.collection);
            }

            this.model = model;
            this.collection = collection;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.collection, 'add', this.addPage);
            this.listenTo(this.collection, 'remove', this.removePage);
            this.render(model);
        },
        //Renders the pie chart.
        render: function (model) {
            //Get's called when any of the models properties change and when an item is added or removed from the pages collection.

            this.block();

            this.$content.empty();
            this.$content.html(this.template(this.model.toJSON()));

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
            var count = this.model.get('migration_status_' + pageModel.get('migration_status') );
            this.model.set('migration_status_' + pageModel.get('migration_status'), count + 1);
        },
        removePage: function (pageModel) {
            //When an item is removed from the sites pages collection.
            //Update the status counts on this views model, which is a Site model.
            var count = this.model.get('migration_status_' + pageModel.get('migration_status') );
            this.model.set('migration_status_' + pageModel.get('migration_status'), count - 1);
        }
    });

    //Helper class to keep track of our main views.
    var App = {
        infoPane: new InfoPaneView(),
        siteInfoPane: new SiteInfoPaneView(),
        switchView: function (model, treeNode) {
            if (treeNode.type === 'page' || treeNode.type === 'default') {
                this.infoPane.render(model, treeNode);
                var siteTreeNode = getSiteTreeNode(treeNode);
                this.siteInfoPane.switchModels(siteTreeNode.data.model, siteTreeNode.data.pages, siteTreeNode);
            } else if (treeNode.type === 'site') {
                this.infoPane.empty();
                this.siteInfoPane.switchModels(model, treeNode.data.pages, siteTreeNode);
            }
        },
        tree: null
    }


    $.jstree.defaults.core.themes.variant = "large";
    $.jstree.defaults.core.themes.stripes = true;

    //rootData will be filled with a collection of Sites from our custom endpoint.
    var rootData = {};

    //Show the loading animation on the network tree view while it's loading for the first time.
    $('.network_browser_tree_container').block({
        message: null,
        overlayCSS: {
            background: '#000',
            opacity: 0.2
        }
    });

    setLoading(true);


    //Initialize the API for the Sites endpoint.  Creates a collection of Site models and stores it in rootData.
    wp.api.init({
        apiRoot: wp_iab_params.api_url
    }).done(function () {

        rootData = {
            models: _.extend({}, this.models),
            collections: _.extend({}, this.collections),
            sitesCollection: new this.collections.Sites()
        }

        rootData.sitesCollection.fetch({data: {per_page: 0}}).done(loadTree);
    });

    //Initialize the tree and hook up all the actions.
    function loadTree() {
        App.tree = $('#network_browser_tree').jstree({
            'types': {
                'default': {},
                'page': {
                    'valid_children': ['page']
                },
                'site': {
                    'icon': "glyph-icon fa fa-globe font-green",
                    'valid_children': ['page']
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
                            var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                            inst.create_node(obj, {
                                    type: 'site',
                                    text: wp_iab_params.labels.new_site
                                },

                                'last', function (new_node) {
                                    console.log('Create Site Node');
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
                        tmp.create.label = wp_iab_params.labels.new_page;
                        tmp.create.action = function (data) {
                            var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                            inst.create_node(obj, {
                                    type: 'page',
                                    icon : 'glyph-icon fa fa-file font-new',
                                    text: wp_iab_params.labels.new_page
                                },

                                'last', function (new_node) {
                                    //The actual Page model is saved when the rename action is finalized, which is called after jstree rename is complete.
                                    setTimeout(function () {
                                        inst.edit(new_node);
                                    }, 0);
                                });
                        };

                        //Reset the remove action to delete the page model.
                        tmp.remove.action = function (data) {
                            var inst = $.jstree.reference(data.reference)
                            var nodeToDelete = inst.get_node(data.reference);
                            var domNodeToDelete = inst.get_node(data.reference, true);

                            setLoading(true, domNodeToDelete);
                            nodeToDelete.data.model.destroy().done(function () {
                                setTimeout(function () {
                                    inst.delete_node(nodeToDelete);
                                    setLoading(false, domNodeToDelete);
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

                        if (node_parent.type === 'site') {
                            return false;
                        }

                        var current_node_site_id = node.parents[node.parents.length - 3]
                        var new_node_site_id = node_parent.type === 'site' ? node_parent.id : node_parent.parents[node_parent.parents.length - 3]

                        if (current_node_site_id !== new_node_site_id) {
                            return false;
                        }
                    }

                    return true;
                },
                'data': function (node, cb) {
                    var treeInstance = this;

                    //This is the root node from jstree.  Here we want to use the sites collection, loaded in rootData.sitesCollection on initial page load.
                    //Create a tree node for each Site model. This gives us the first level of the tree.
                    if (node.id === '#') {
                        network_sites = [];
                        //Loop though each Site model and create a jstree node
                        rootData.sitesCollection.each(function (site) {
                            network_sites.push({
                                id: 'site-' + site.id,
                                text: site.get('title'),
                                children: true,
                                type: 'site',
                                data: {
                                    model: site,
                                }
                            });
                        });

                        //Call the jstree callback, setting children to each tree node which represents a Site model.
                        cb.call(this,
                            {
                                id: 'root',
                                text: wp_iab_params.root_node_text,
                                children: network_sites,
                                type: 'network',
                                state: {
                                    'opened': true,
                                    'selected': false,
                                    'disabled': false
                                },
                            }
                        );
                    } else {

                        //This loads the first level of pages from a site.
                        if (node.parent === 'root') {

                            var site_id = node.data.model.id;

                            /*
                             Because of how WP API init works we need to load our models and collections from the rootData endpoint which
                             we have already loaded on initial page load.  If we don't do this the root site's objects will get the URL from the
                             last site we opened.

                             TODO:  Review using the wp.api.init method to build the Pages collection, seems like there should be a more efficent way.
                             */
                            if (site_id == wp_iab_params.root_site_id) {
                                node.data.api = {
                                    models: {},
                                    collections: {}
                                };

                                node.data.api.models = rootData.models;//Keep a reference to the models, not used but here for future use.
                                node.data.api.collections = rootData.collections;//Keep a reference to the collections, not used but here for future use.
                                node.data.pages = new node.data.api.collections.Pages();
                                //Tell the sites Pages collection to fetch it's data.
                                //Reset is set to false so that the collection is not emptied after the collection syncs.
                                node.data.pages.fetch({
                                    merge: true, silent: true, add: true, remove: false,
                                    data: {
                                        'orderby': 'menu_order',
                                        'order': 'asc',
                                        'parent': 0,
                                        'nopaging': true,
                                    }
                                }).done(function (items) {
                                    cb.call(treeInstance, items.map(function (post) {
                                            return {
                                                id: site_id + '-' + 'item-' + post.id,
                                                text: post.title.rendered,
                                                children: post.has_children,
                                                type: 'page',
                                                icon: getNodeIcon(node.data.pages.get(post.id)),
                                                data: {
                                                    model: node.data.pages.get(post.id),
                                                }
                                            }
                                        })
                                    );
                                });

                            } else {
                                wp.api.init({
                                    apiRoot: node.data.model.get('url') + '/wp-json/'
                                }).done(function () {

                                    node.data.api = {
                                        models: {},
                                        collections: {}
                                    };

                                    //When the WP JSON client library completes here we need to copy models, collection and create a new instance of the Pages collection.
                                    node.data.api.models = _.extend({}, this.models);//Keep a reference to the models, not used but here for future use.
                                    node.data.api.collections = _.extend({}, this.collections);//Keep a reference to the collections, not used but here for future use.
                                    node.data.pages = new node.data.api.collections.Pages();

                                    //Tell the sites Pages collection to fetch it's data.
                                    //Reset is set to false so that the collection is not emptied after the collection syncs.
                                    node.data.pages.fetch({
                                        merge: true, silent: true, add: true, remove: false,
                                        data: {
                                            'orderby': 'menu_order',
                                            'order': 'asc',
                                            'parent': 0,
                                            'per_page': 100,
                                        }
                                    }).done(function (items) {

                                        if (node.data.pages.hasMore()) {
                                            //TODO:  Determine a better method to handle this situation where there are more than 100 pages.
                                            alert('This site has more than 100 children at the root.   Consider moving pages into smaller sections.');
                                        }

                                        cb.call(treeInstance, items.map(function (post) {
                                                return {
                                                    id: site_id + '-' + 'item-' + post.id,
                                                    text: post.title.rendered,
                                                    children: post.has_children,
                                                    type: 'page',
                                                    icon: getNodeIcon(node.data.pages.get(post.id)),
                                                    data: {
                                                        model: node.data.pages.get(post.id),
                                                    }
                                                }
                                            })
                                        );
                                    });

                                });
                            }
                        } else {
                            //Get the nodes parent site node.
                            //The site node has a reference to the collection for it's pages.
                            var siteTreeNode = getSiteTreeNode(node);

                            siteTreeNode.data.pages.fetch({
                                merge: true, silent: true, add: true, remove: false,
                                data: {
                                    'orderby': 'menu_order',
                                    'order': 'asc',
                                    'parent': node.data.model.id,
                                    //The WP REST api by default only allows 1 - 100 pages to be fetched at once.
                                    'per_page': 100,
                                }
                            }).done(function (items) {

                                if (siteTreeNode.data.pages.hasMore()) {
                                    //TODO:  Determine a better method to handle this situation where there are more than 100 pages.
                                    alert('This page has more than 100 children.   Consider moving pages into smaller sections.');
                                }

                                cb.call(treeInstance, items.map(function (post) {
                                    return {
                                        id: siteTreeNode.data.model.id + '-' + 'item-' + post.id,
                                        text: post.title.rendered,
                                        children: post.has_children,
                                        type: post.has_children ? 'default' : 'page',
                                        icon: getNodeIcon(siteTreeNode.data.pages.get(post.id)),
                                        data: {
                                            //Set the treenode's data.model property to the actual page model.
                                            model: siteTreeNode.data.pages.get(post.id),
                                        }
                                    }
                                }));
                            });
                        }

                    }
                }
            }
        })
            .on('loading_node.jstree', function (e, treeNodeData) {
                if (treeNodeData.node.type === 'site') {
                    App.switchView(treeNodeData.node.data.model, treeNodeData.node);
                }
                setLoading(true);
            })
            .on('load_node.jstree', function (e, treeNodeData) {
                setLoading(false);
            })
            .on('loaded.jstree', function (e, treeNodeData) {
                console.log('Loaded');
                setLoading(false);
            })
            .on('create_node.jstree', function (e, treeNodeData) {

                if (treeNodeData.node.type === 'site') {
                    var parentNode = treeNodeData.instance.get_node(treeNodeData.node.parent);

                    var siteModel = new rootData.models.Sites({
                        title: treeNodeData.node.text,
                        domain: wp_iab_params.domain,
                    });

                    rootData.sitesCollection.add(siteModel);

                    treeNodeData.node.data = {
                        model: siteModel
                    };

                    treeNodeData.instance.deselect_all();
                    treeNodeData.instance.select_node(treeNodeData.node)

                } else {
                    //Get the parent tree view node.
                    var parentNode = treeNodeData.instance.get_node(treeNodeData.node.parent);

                    //Reference to the site id.
                    var siteTreeNode = getSiteTreeNode(treeNodeData.node);

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
                    }

                    treeNodeData.instance.deselect_all();
                    treeNodeData.instance.select_node(treeNodeData.node)
                }

            })
            .on('rename_node.jstree', function (e, treeNodeData) {

                var domNode = $('#' + treeNodeData.node.id);

                if (treeNodeData.node.type === 'site') {
                    treeNodeData.node.data.model.set('title', treeNodeData.node.text);
                    treeNodeData.node.data.model.set('slug', ''); //empty slug so the server will generate it for us.
                    setLoading(true, domNode);
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
                                setLoading(false, domNode);
                            });
                        }
                    });

                } else {
                    if (treeNodeData.node.data.model.get('title') !== treeNodeData.node.text) {
                        treeNodeData.node.data.model.set('title', {
                            raw: treeNodeData.node.text,
                            rendered: treeNodeData.node.text
                        });

                        setLoading(true, domNode);
                        treeNodeData.node.data.model.save().done(function () {
                            App.switchView(treeNodeData.node.data.model, treeNodeData.node);
                            setLoading(false, domNode);
                        })

                    }
                }
            })
            .on('move_node.jstree', function (e, data) {

                //parent node is the new parent in jsTree.
                data.instance.deselect_all();
                var parentNode = data.instance.get_node(data.node.parent);
                var parentDomNode = data.instance.get_node(data.node.parent, true);
                var siteNode = getSiteTreeNode(parentNode);

                setLoading(true, parentDomNode);

                var parent_wp_id = 0;

                //if the parent is site, the wp parent id needs to remian 0
                if (parentNode.type !== 'site') {
                    parent_wp_id = parentNode.data.model.id;
                }

                //Reset the icon to a folder, since we know for sure that it has children now.
                data.instance.set_icon(parent, 'glyph-icon fa fa-folder font-blue');

                var activeCalls = parentNode.children.length - data.position;

                for (var i = 0; i < parentNode.children.length; i++) {
                    if (i >= data.position) {
                        var child = data.instance.get_node(parentNode.children[i]);

                        child.data.model.set('parent', parent_wp_id);
                        child.data.model.set('menu_order', i);

                        //Set the spinner on the individual item
                        $('#' + siteNode.data.model.id + '-item-' + child.data.model.id).addClass('jstree-loading').attr('aria-busy', true);

                        child.data.model.save().done(function (result) {
                            //Remove the spinner from this specific item.
                            $('#' + siteNode.data.model.id + '-item-' + result.id).removeClass('jstree-loading').attr('aria-busy', false);

                            activeCalls--;
                            if (activeCalls === 0) {
                                data.instance.get_node(data.node.parent, true).removeClass("jstree-loading").attr('aria-busy', false);
                                setLoading(false);
                                App.switchView(data.node.data.model, data.node);
                            }
                        });

                    }
                }
            })
            .on('changed.jstree', function (e, data) {

                if (data && data.selected && data.selected.length === 1 && (data.node.type == 'page' || data.node.type == 'default')) {
                    var site_id = data.node.data.model.get('site_id');
                    App.switchView(data.node.data.model, data.node);
                } else if (data && data.selected && data.selected.length === 1 && data.node.type === 'site') {
                    App.switchView(data.node.data.model, data.node);
                }
            })
            .on('ready.jstree', function (e) {
                setLoading(false);
                $('.network_browser_tree_container').unblock();
            })

    }

    function getSiteTreeNode(node) {
        var parent = App.tree.jstree('get_node', node.parents[node.parents.length - 3]);
        return parent;
    }

    function setLoading(loading, domNode) {
        if (loading) {
            if (domNode) {
                domNode.addClass("jstree-loading").attr('aria-busy', true);
            }

            $('.loading-icon').removeClass('fa-circle-o').addClass('fa-circle-o-notch fa-spin');

            $('#network_browser_tree').block({
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

            $('#network_browser_tree').unblock();
            $('.loading-icon').removeClass('fa-circle-o-notch fa-spin').addClass('fa-circle-o');
        }
    }

    function getNodeIcon(pageModel) {
        var icon = 'glyph-icon fa ' + (pageModel.get('has_children') ? 'fa-folder' : 'fa-file');
        var iconColor = '';
        switch (pageModel.get('migration_status')) {
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
    });

}(jQuery));
