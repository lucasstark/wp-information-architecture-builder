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

            this.networkNode = new wp.jstree.NetworkNode(1);

        },
        blockViews : function(){
            this.siteView.block();
            this.itemView.block();
        },
        unblockViews : function(){
            this.siteView.unblock();
            this.itemView.unblock();
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

            //Helper to prevent tab from moving to the Info Pane title field before rename is complete.
            this.$tree.on('keydown', '.jstree-rename-input', function(e){
                var key = e.which;
                if (key === 9) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.blur();
                }
            });

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
                                var networkNode = treeInstance.get_node(data.reference);


                                networkNode.data.treeCreateNode().done(function (newTreeNode) {
                                    treeInstance.create_node(networkNode, newTreeNode,
                                        'last', function (new_node) {
                                            setTimeout(function () {
                                                treeInstance.edit(new_node);
                                            }, 0);
                                        });
                                });
                            };

                            //Remove other actions since create site is the only allowed operation.
                            delete tmp.ccp;
                            delete tmp.rename;

                            //Reset the remove action to delete the page model.
                            tmp.remove.action = function (data) {
                                var treeInstance = $.jstree.reference(data.reference)
                                var nodeToDelete = treeInstance.get_node(data.reference);
                                var domNodeToDelete = treeInstance.get_node(data.reference, true);

                                wp.jstree.ui.setLoading(true, domNodeToDelete);
                                nodeToDelete.data.model.destroy().done(function () {
                                    setTimeout(function () {
                                        treeInstance.delete_node(nodeToDelete);
                                        wp.jstree.ui.setLoading(false, domNodeToDelete);
                                    }, 0);
                                });

                            }

                        } else {
                            delete tmp.ccp;
                            //Context menu for any page.
                            //Reset the create action to create a new tree node and then call the edit function.
                            tmp.create.label = wp_iab_params.labels.newItem;
                            tmp.create.action = function (data) {
                                var treeInstance = $.jstree.reference(data.reference);
                                var parentTreeNode = treeInstance.get_node(data.reference);

                                parentTreeNode.data.treeCreateNode(parentTreeNode.children.length).done(function (newTreeNode) {
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

                            if (node.type === 'root') {
                                return false;
                            }

                            return true;
                        }

                        return true;
                    },
                    'data': function (node, cb) {
                        var treeInstance = this;

                        //This is the root node from jstree.
                        if (node.id === '#') {

                            view.networkNode.fetch().done(function (result) {
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
                            treeNodeData.instance.refresh(treeNodeData.node);
                        });

                    } else {

                        if (treeNodeData.node.data.model.get('title').rendered !== treeNodeData.node.text) {

                            var updateData = {
                                'title': {
                                    raw: treeNodeData.node.text,
                                    rendered: treeNodeData.node.text
                                },
                                'status': 'publish'
                            };

                            wp.jstree.ui.setLoading(true, domNode);
                            view.blockViews();
                            treeNodeData.node.data.model.save(updateData, {'wait': true}).done(function () {
                                wp.jstree.ui.setLoading(false, domNode);
                                view.unblockViews();
                            });

                        }
                    }
                })
                .on('move_node.jstree', function (e, treeNodeData) {

                    //parent node is the new parent in jsTree.
                    treeNodeData.instance.deselect_all();
                    var parentNode = treeNodeData.instance.get_node(treeNodeData.node.parent);
                    var parentDomNode = treeNodeData.instance.get_node(treeNodeData.node.parent, true);

                    var currentNode = treeNodeData.node;


                    wp.jstree.ui.setLoading(true, parentDomNode);

                    var parent_wp_id = 0;

                    //if the parent is site, the wp parent id needs to remian 0
                    if (parentNode.type !== 'site') {
                        parent_wp_id = parentNode.data.model.get('id');
                        //Reset the icon to a folder, since we know for sure that it has children now.
                        treeNodeData.instance.set_icon(parent, 'glyph-icon fa fa-folder font-blue');
                    }

                    if (parentNode.data.getSiteId() !== currentNode.data.getSiteId()) {
                        //Moving items between sites.

                        parentNode.data.getApi().importTreeNode(treeNodeData.instance, currentNode, parent_wp_id).then(function () {
                            parentDomNode.removeClass('jstree-loading').attr('aria-busy', false);
                        });

                        return;
                    }


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

                        if (treeNodeData.node.type !== 'site') {

                            //treeNodeData.node.data.getApi().expandChildren(treeNodeData.instance, treeNodeData.node).done(
                            //  function(results) {
                            //    console.log(results);
                            //}
                            //)

                        }

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
