(function ($) {

    var InfoPaneView = Backbone.View.extend({
        treeNode: {},
        template: _.template($('#info-pane-template').html()),
        el: $('#info-pane'),
        events: {
            "click .btn-save": "save",
            "click .btn-delete": "delete",
            "click .btn-cancel": 'cancel',
        },
        initialize: function (options) {

        },
        render: function (model, treeNode) {
            this.model = model;
            this.treeNode = treeNode;
            this.$el.html(this.template(this.model.attributes));
            this.$el.find('input.title').eq(0).focus(function () {
                $(this).select()
            });
        },
        save: function (e) {
            e.preventDefault();
            var title = this.$el.find('input.title').eq(0).val();
            this.model.set('title', {
                raw: title,
                rendered: title
            });
            this.model.save();
            var inst = $.jstree.reference(this.treeNode);
            inst.rename_node(this.treeNode, title);
        },
        delete: function (e) {
            e.preventDefault();
        },
        cancel: function (e) {
            e.preventDefault();
        }
    });

    var App = {
        infoPane: new InfoPaneView(),
        switchView: function (model, treeNode) {
            // this.infoPane.remove();
            // this.infoPane = new InfoPaneView();
            this.infoPane.render(model, treeNode);
        },
    }


    $.jstree.defaults.core.themes.variant = "large";
    var id = 10;

    var sites = [];
    var rootData = {};

    wp.api.init({
        apiRoot: 'http://local.ucc.edu/wp-json/'
    }).done(function () {

        rootData = {
            models: _.extend({}, this.models),
            sitesCollection: new this.collections.Sites()
        }

        rootData.sitesCollection.fetch({data: {per_page: 0}}).done(loadTree);
    });


    function loadTree() {
        $('#network_browser_tree').jstree({
            'types': {
                'default': {
                    'icon': "glyph-icon fa fa-folder font-blue",
                },
                'page': {
                    'icon': "glyph-icon fa fa-file font-green",
                    'valid_children': ['page']
                },
                'site': {
                    'icon': "glyph-icon fa fa-globe font-green",
                }
            },
            "plugins": [
                "types", "contextmenu", "dnd",
            ],
            'dnd': {
                'is_draggable': function (nodes) {
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].type == 'site') {
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
                    delete tmp.remove;


                    console.log(node.id);

                    if (node.id === 'root') {
                        tmp.create.label = 'New Site';
                        tmp.create.action = function (data) {
                            var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                            inst.create_node(obj, {
                                    type: 'site',
                                    text: 'New Site'
                                },

                                'last', function (new_node) {
                                    setTimeout(function () {
                                        inst.edit(new_node);
                                    }, 0);
                                });
                        };
                    } else {
                        tmp.create.label = 'New Page';
                        tmp.create.action = function (data) {
                            var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                            inst.create_node(obj, {
                                    type: 'page',
                                    text: 'New Page'
                                },

                                'last', function (new_node) {
                                    setTimeout(function () {
                                        inst.edit(new_node);
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

                    if (node.id === '#') {
                        var endpoint = 'http://local.ucc.edu/wp-json/wp/v2/sites/';

                        $.ajax({
                            url: endpoint,
                            success: function (data) {

                                var network_sites = data.map(function (site) {

                                    sites[site.id] = {};



                                    return {
                                        id: 'site-' + site.id,
                                        text: site.title,
                                        children: true,
                                        type: 'site',
                                        data: {
                                            model: rootData.sitesCollection.get(site.id),
                                            wp_data: {
                                                site_id: site.id,
                                                site_path: site.path,
                                                post_id: 0,
                                            }
                                        }
                                    }
                                });

                                cb.call(this,
                                    {
                                        id: 'root',
                                        text: 'Sites',
                                        children: network_sites,
                                        type: 'site',
                                        state: {
                                            'opened': true,
                                            'selected': false,
                                            'disabled': false
                                        },
                                    }
                                );
                            },
                            cache: true
                        });
                    } else {

                        if (node.parent === 'root') {
                            console.log('Load Site Root Pages');
                            var site_id = node.data.model.id;

                            wp.api.init({
                                apiRoot: node.data.model.get('url') + '/wp-json/'
                            }).done(function () {

                                sites[site_id].api = {
                                    models: {},
                                    collections: {}
                                };

                                sites[site_id].api.models = _.extend({}, this.models);
                                sites[site_id].api.collections = _.extend({}, this.collections);
                                sites[site_id].pages = new sites[site_id].api.collections.Pages();
                                sites[site_id].pages;

                                sites[site_id].pages.fetch({
                                    merge: true, silent: false, add: true, remove: false,
                                    data: {
                                        'orderby': 'menu_order',
                                        'order': 'asc',
                                        'parent': 0
                                    }
                                }).done(function (items) {

                                    cb.call(this, items.map(function (post) {
                                            return {
                                                id: site_id + '-' + 'item-' + post.id,
                                                text: post.title.rendered,
                                                children: post.has_children,
                                                type: post.has_children ? 'default' : 'page',
                                                data: {
                                                    model: sites[site_id].pages.get(post.id),
                                                }
                                            }
                                        })
                                    );
                                });

                            });


                        } else {

                            var site_id = node.data.model.get('site_id');
                            var site_path = sites[site_id].path;

                            sites[site_id].pages.fetch({
                                merge: true, silent: false, add: true, remove: false,
                                data: {
                                    'orderby': 'menu_order',
                                    'order': 'asc',
                                    'parent': node.data.model.id
                                }
                            }).done(function (items) {

                                cb.call(this, items.map(function (post) {
                                    return {
                                        id: site_id + '-' + 'item-' + post.id,
                                        text: post.title.rendered,
                                        children: post.has_children,
                                        type: post.has_children ? 'default' : 'page',
                                        data: {
                                            model: sites[site_id].pages.get(post.id),
                                        }
                                    }
                                }));
                            });
                        }

                    }
                }
            }
        })
            .on('before_open.jstree', function (e, treeNodeData) {
                console.log('Before Open');
            })
            .on('loading.jstree', function (e, treeNodeData) {
                console.log('Loading');
            })
            .on('create_node.jstree', function (e, treeNodeData) {

                if (treeNodeData.node.type === 'site') {
                    var parentNode = treeNodeData.instance.get_node(treeNodeData.node.parent);
                    var siteModel = new rootData.models.Sites({
                        title: treeNodeData.node.text,
                        domain: 'local.ucc.edu',
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
                    var site_id = parentNode.type === 'site' ? parentNode.data.model.id : parentNode.data.model.get('site_id');

                    //If parent type is site post_parent will be 0, otherwise get the ID of the parent Page Model
                    var parent_id = parentNode.type === 'site' ? 0 : parentNode.data.model.id;

                    var page_model = new sites[site_id].api.models.Page({
                        site_id: site_id,
                        title: {
                            raw: treeNodeData.node.text,
                            rendered: treeNodeData.node.text
                        },
                        status: 'publish',
                        parent: parent_id,
                        link: '',
                        menu_order: parentNode.children.length + 1
                    });

                    //Add the new Page Model to the collection.
                    sites[site_id].pages.add(page_model);

                    //Add the Page Model reference to the tree node.
                    treeNodeData.node.data = {
                        model: page_model,
                    }

                    treeNodeData.instance.deselect_all();
                    treeNodeData.instance.select_node(treeNodeData.node)
                }

            })
            .on('rename_node.jstree', function (e, treeNodeData) {
                if (treeNodeData.node.type === 'site') {
                    treeNodeData.node.data.model.set('title', treeNodeData.node.text);
                    treeNodeData.node.data.model.set('slug', ''); //empty slug so the server will generate it for us.
                    treeNodeData.node.data.model.save().done(function(){

                        treeNodeData.node.children = true;
                        treeNodeData.instance.refresh(treeNodeData.node);

                        if (!sites[treeNodeData.node.data.model.id]){

                            sites[treeNodeData.node.data.model.id] = {};

                            wp.api.init({
                                apiRoot: treeNodeData.node.data.model.get('url') + '/wp-json/'
                            }).done(function () {

                                sites[treeNodeData.node.data.model.id].api = {
                                    models: {},
                                    collections: {}
                                };

                                sites[treeNodeData.node.data.model.id].api.models = _.extend({}, this.models);
                                sites[treeNodeData.node.data.model.id].api.collections = _.extend({}, this.collections);
                                sites[treeNodeData.node.data.model.id].pages = new sites[treeNodeData.node.data.model.id].api.collections.Pages();
                            });

                        }
                    });



                } else {
                    if (treeNodeData.node.data.model.get('title') !== treeNodeData.node.text) {
                        treeNodeData.node.data.model.set('title', {
                            raw: treeNodeData.node.text,
                            rendered: treeNodeData.node.text
                        });
                        treeNodeData.node.data.model.save();
                        App.switchView(treeNodeData.node.data.model, treeNodeData.node);
                    }
                }
            })
            .on('move_node.jstree', function (e, data) {

                var site_id = data.node.data.model.get('site_id');
                var site_path = sites[site_id].path;

                var parent = data.instance.get_node(data.node.parent);
                var parent_wp_id = 0;

                if (parent.type !== 'site') {
                    parent_wp_id = parent.data.model.id;
                }

                data.instance.set_icon(parent, 'glyph-icon fa fa-folder font-blue');

                for (var i = 0; i < parent.children.length; i++) {
                    var child = data.instance.get_node(parent.children[i]);
                    child.data.model.set('parent', parent_wp_id);
                    child.data.model.set('menu_order', i);
                    child.data.model.save();
                }

            })
            .on('changed.jstree', function (e, data) {

                if (data && data.selected && data.selected.length === 1 && (data.node.type == 'page' || data.node.type == 'default')) {
                    var site_id = data.node.data.model.get('site_id');
                    App.switchView(data.node.data.model, data.node);
                }
                else {
                    //$('#data .content').hide();
                    // $('#data .default').text('Select a file from the tree.').show();
                }
            });
    }

    /*
     window.apisites = {};

     wp.api.init({
     apiRoot: 'http://local.example.edu' + '/wp-json/'
     }).done(function () {
     window.apisites['root'] = _.extend({}, this.collections);
     });

     wp.api.init({
     apiRoot: 'http://local.example.edu/admissions' + '/wp-json/'
     }).done(function () {
     window.apisites['admissions'] = _.extend({}, this.collections);
     });

     wp.api.init({
     apiRoot: 'http://local.example.edu/administration' + '/wp-json/'
     }).done(function () {
     window.apisites['administration'] = _.extend({}, this.collections);
     });
     */
}(jQuery));
