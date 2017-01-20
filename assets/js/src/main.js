;(function ($, WPIAB) {



    //The API has been initialized already since we are passing in the schema directly.
    //It's not a mistake that we are not using the wp.api.loadPromise().done method.

    var temp = new wp.api.collections.Pages();

    var SiteModel = function (attributes, options) {
        wp.api.models.Sites.call(this, attributes, options);
    }

    SiteModel.prototype = Object.create(wp.api.models.Sites.prototype);

    SiteModel.prototype.getChildren = function () {
        return this.pages.fetch(0);
    }


    var PageModel = function (attributes, options) {
        wp.api.models.Page.call(this, attributes, options);
    }

    PageModel.prototype = Object.create(wp.api.models.Page.prototype);


    PageModel.prototype.getChildren = function () {
        return this.collection.fetch(this.get('id'));
    }


    var PagesCollection = function (baseUrl, models, options) {
        wp.api.collections.Pages.call(this, models, options);
        this.model = PageModel;
        this.baseUrl = baseUrl;
    };

    PagesCollection.prototype = Object.create(wp.api.collections.Pages.prototype);

    PagesCollection.prototype.url = function () {
        return this.baseUrl + this.route.index;
    }

    PagesCollection.prototype.fetch = function (parent, options) {
        //Set the defaults for our fetch actions.
        options = _.extend({parse: true}, {
            merge: true, silent: true, add: true, remove: false,
            data: {
                'orderby': 'menu_order',
                'order': 'asc',
                'parent': parent,
                'per_page': 100,
            }
        });

        return wp.api.collections.Pages.prototype.fetch.call(this, options);
    }


    var SitesCollection = function (baseUrl, models, options) {
        wp.api.collections.Sites.call(this, models, options);
        this.model = SiteModel;
        this.baseUrl = baseUrl;
    }

    SitesCollection.prototype = Object.create(wp.api.collections.Sites.prototype);


    var PageView = function (parentView, model) {
        this.model = model;
        this.siteView = parentView.siteView || parentView; //If no siteView property set on parent, the parent is the siteView
        this.parentView = parentView;
        this.views = [];
    }

    _.extend(PageView.prototype, Backbone.Events);

    PageView.prototype.onSelect = function (treeNode) {
        this.trigger('builder:page:selected', this, treeNode);
    }

    PageView.prototype.getChildren = function () {
        var self = this;

        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        self.siteView.collection.fetch(this.model.get('id')).done(function (results) {
            self.views = results.map(function (result) {
                return new PageView(self, self.siteView.collection.get(result.id));
            });

            self.views.forEach(function (view) {
                self.listenTo(view, 'builder:page:selected', function (sender, treeNode) {
                    self.trigger('builder:page:selected', sender, treeNode);
                });
            });

            deferred.resolveWith(self, [self.views]);
        });

        return promise;
    }

    PageView.prototype.onMoveNode = function (e, data) {

        //parent node is the new parent in jsTree.
        data.instance.deselect_all();

        var parentNode = data.instance.get_node(data.node.parent);
        //var parentDomNode = data.instance.get_node(data.node.parent, true);

        this.parentView.viewRemove(this);
        parentNode.data.view.viewAdd(this);

        var parent_wp_id = 0;

        //if the parent is site, the wp parent id needs to remian 0
        if (parentNode.type !== 'site') {
            parent_wp_id = parentNode.data.view.model.get('id');
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

                child.data.view.model.set('parent', parent_wp_id);
                child.data.view.model.set('menu_order', i);

                //Set the spinner on the individual item
                $('#' + child.data.view.getSiteId() + '-item-' + child.data.view.model.get('id')).addClass('jstree-loading').attr('aria-busy', true);

                child.data.view.model.save().done(doneFunction);
            }
        }
    }

    PageView.prototype.viewAdd = function (view) {
        var self = this;
        view.parentView = self;
        self.views.push(view);
        self.listenTo(view, 'builder:page:selected', function (sender, treeNode) {
            self.trigger('builder:page:selected', sender, treeNode);
        });
    }

    PageView.prototype.viewRemove = function (view) {
        var idx = this.views.indexOf(view);
        if (idx != -1) {
            this.stopListening(view);
            this.views = this.views.splice(idx, 1);
        }
    }

    PageView.prototype.getSiteId = function () {
        return this.siteView.model.get('id');
    };

    PageView.prototype.getTreeNodeIcon = function () {
        var icon = 'glyph-icon fa ' + (this.model.get('has_children') ? 'fa-folder' : 'fa-file');
        var iconColor = '';
        switch (this.model.get('migration_status')) {
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

    PageView.prototype.getTreeNodeId = function () {
        return this.getSiteId() + '-' + 'item-' + this.model.get('id');
    }


    var SiteView = function (model) {
        this.model = model;
        this.collection = new PagesCollection(model.get('url') + '/wp-json');
        this.views = [];
    }

    _.extend(SiteView.prototype, Backbone.Events);

    SiteView.prototype.onSelect = function (treeNode) {
        this.trigger('builder:site:selected', this, treeNode);
    }

    SiteView.prototype.getChildren = function () {
        var self = this;

        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        this.collection.fetch(0).done(function () {
            self.views = self.collection.map(function (model) {
                return new PageView(self, model);
            });

            self.views.forEach(function (view) {
                self.listenTo(view, 'builder:page:selected', function (sender, treeNode) {
                    self.trigger('builder:page:selected', sender, treeNode);
                })
            });

            deferred.resolveWith(self, [self.views]);
        });

        return promise;

    }

    SiteView.prototype.getSiteId = function () {
        return this.model.get('id');
    }


    var NetworkView = function (baseUrl) {
        baseUrl = baseUrl || wp_iab_params.api_url;
        this.collection = new SitesCollection(baseUrl);
        this.views = [];
        this.infoPane = new WPIAB.views.InfoPaneView();
        this.siteInfoPane = new WPIAB.views.SiteInfoPaneView();
    }

    _.extend(NetworkView.prototype, Backbone.Events);

    NetworkView.prototype.getChildren = function () {
        var self = this;

        var deferred = jQuery.Deferred();
        var promise = deferred.promise();

        this.collection.fetch({data: {per_page: 0}}).done(function () {

            self.views = self.collection.map(function (model) {
                return new SiteView(model);
            });

            self.views.forEach(function (view) {
                self.listenTo(view, 'builder:page:selected', function (sender, treeNode) {
                    self.infoPane.render(sender.model, treeNode);
                    self.siteInfoPane.switchModels(sender.siteView.model, sender.siteView.collection, treeNode);
                });

                self.listenTo(view, 'builder:site:selected', function (sender, treeNode) {
                    self.siteInfoPane.switchModels(sender.model, sender.collection, treeNode);
                });

            })

            deferred.resolveWith(self, [self.views]);
        });

        return promise;

    }


    var networkView = new NetworkView();


    $.jstree.defaults.core.themes.variant = "large";
    $.jstree.defaults.core.themes.stripes = true;

    $('#network_browser_tree').jstree({
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
                                icon: 'glyph-icon fa fa-file font-new',
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
                        var inst = $.jstree.reference(data.reference);
                        var nodeToDelete = inst.get_node(data.reference);
                        var domNodeToDelete = inst.get_node(data.reference, true);

                        WPIAB.setLoading(true, domNodeToDelete);
                        nodeToDelete.data.model.destroy().done(function () {
                            setTimeout(function () {
                                inst.delete_node(nodeToDelete);
                                WPIAB.setLoading(false, domNodeToDelete);
                            }, 0);
                        });

                    };

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

                    var current_node_site_id = node.data.view.getSiteId();
                    var new_node_site_id = node_parent.data.view.getSiteId();

                    if (current_node_site_id !== new_node_site_id) {
                        return false;
                    }
                }

                return true;
            },
            'data': function (node, cb) {
                var treeInstance = this;

                if (node.id === '#') {
                    networkView.getChildren().done(function (views) {
                        var self = this;

                        var treeItems = views.map(function (view) {
                            return {
                                id: 'site-' + view.model.id,
                                text: view.model.get('title'),
                                children: true,
                                type: 'site',
                                data: {
                                    view: view,
                                }
                            };
                        });

                        //Call the jstree callback, setting children to each tree node which represents a Site.
                        cb.call(treeInstance,
                            {
                                id: 'root',
                                text: wp_iab_params.root_node_text,
                                children: treeItems,
                                type: 'network',
                                state: {
                                    'opened': true,
                                    'selected': false,
                                    'disabled': false
                                },

                            }
                        );

                    });
                } else {
                    node.data.view.getChildren().done(function (pageViews) {
                        cb.call(treeInstance, pageViews.map(function (pageView) {
                            return {
                                id: pageView.getTreeNodeId(),
                                text: pageView.model.get('title').rendered,
                                children: pageView.model.get('has_children'),
                                type: pageView.model.get('has_children') ? 'default' : 'page',
                                icon: pageView.getTreeNodeIcon(),
                                data: {
                                    view: pageView
                                }
                            };
                        }));
                    })
                }
            }
        }
    })
        .on('loading_node.jstree', function (e, treeNodeData) {
            if (treeNodeData.node.type === 'site') {
                //WPIAB.App.switchView(treeNodeData.node.data.model, treeNodeData.node);
            }
            WPIAB.setLoading(true);
        })
        .on('load_node.jstree', function (e, treeNodeData) {
            WPIAB.setLoading(false);
        })
        .on('loaded.jstree', function (e, treeNodeData) {
            WPIAB.setLoading(false);
        })
        .on('create_node.jstree', function (e, treeNodeData) {
            WPIAB.create_node(e, treeNodeData);
        })
        .on('rename_node.jstree', function (e, treeNodeData) {
            WPIAB.rename_node(e, treeNodeData);
        })
        .on('move_node.jstree', function (e, treeNodeData) {
            treeNodeData.node.data.view.onMoveNode(e, treeNodeData);
        })
        .on('changed.jstree', function (e, data) {
            if (data && data.selected && data.selected.length === 1 && (data.node.type == 'page' || data.node.type == 'default')) {
                data.node.data.view.onSelect(data.node);
            } else if (data && data.selected && data.selected.length === 1 && data.node.type === 'site') {
                data.node.data.view.onSelect(data.node);
            }
            // WPIAB.node_changed(e, data);
        })
        .on('ready.jstree', function (e) {
            WPIAB.setLoading(false);
            $('.network_browser_tree_container').unblock();
        });


    $(document).ready(function () {
        function setHeight() {
            windowHeight = $(window).innerHeight();
            $('.network_browser_tree_container').css('height', windowHeight - 200);
            $('.wrap').css('height', windowHeight);
        }

        setHeight();

        $(window).resize(function () {
            setHeight();
        });
    });

    return;

    //Helper class to keep track of our main views.
    WPIAB.App = {
        infoPane: new WPIAB.views.InfoPaneView(),
        siteInfoPane: new WPIAB.views.SiteInfoPaneView(),
        switchView: function (model, treeNode) {
            if (treeNode.type === 'page' || treeNode.type === 'default') {
                this.infoPane.render(model, treeNode);
                var siteTreeNode = WPIAB.getSiteTreeNode(treeNode);
                this.siteInfoPane.switchModels(siteTreeNode.data.model, siteTreeNode.data.pages, siteTreeNode);
            } else if (treeNode.type === 'site') {
                this.infoPane.empty();
                this.siteInfoPane.switchModels(model, treeNode.data.pages, treeNode);
            }
        },
        tree: null
    };


    //rootData will be filled with a collection of Sites from our custom endpoint.
    WPIAB.rootData = {};

    //Show the loading animation on the network tree view while it's loading for the first time.
    $('.network_browser_tree_container').block({
        message: null,
        overlayCSS: {
            background: '#000',
            opacity: 0.2
        }
    });

    WPIAB.setLoading(true);


    //Initialize the API for the Sites endpoint.  Creates a collection of Site models and stores it in rootData.
    wp.api.init({
        apiRoot: wp_iab_params.api_url
    }).done(function () {

        WPIAB.rootData = {
            models: _.extend({}, this.models),
            collections: _.extend({}, this.collections),
            sitesCollection: new this.collections.Sites()
        };

        WPIAB.rootData.sitesCollection.fetch({data: {per_page: 0}}).done(loadTree);
    });

    //Initialize the tree and hook up all the actions.
    function loadTree() {
    }


    var testObject = {
        name: 'A',
        log: function () {
            this.name = 'B';

            var greeting = 'Hello';

            console.log(this);
            this.log2();

        },
        log2: function () {
            this.name = 'C';
            console.log(this);
        }
    };

    console.log(testObject);

    var logName = function () {
        console.log(this.greeting + ' Lucas');
    };

    testObject.log();

    var add = function (a, b) {
        return a + b;
    };

    console.log(add(1, 1));

    var addTen = add.bind(this, 10);
    console.log(addTen(10));


    var VariationForm = function () {
        this.propertyA = 'test';
    };

    VariationForm.prototype.testFunction = function () {
        console.log(this);
    };

    var vf = new VariationForm();
    vf.testFunction();


    var b = WPIAB.builder();
    console.log(b);


}(jQuery, WPIAB));
