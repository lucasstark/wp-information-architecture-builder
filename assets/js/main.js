(function ($) {


    // $(window).resize(function () {
    //var h = Math.max($(window).height() - 0, 420);
    //$('#container, #data, #tree, #data .content').height(h).filter('.default').css('lineHeight', h + 'px');
    //}).resize();


    $.jstree.defaults.core.themes.variant = "large";
    var id = 10;

    var sites = [];

    $('#tree').jstree({
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
                tmp.create.label = 'New';
                tmp.create.submenu = {
                    'create_page': {
                        'separator_after': true,
                        'label': 'Page',
                        "action": function (data) {
                            var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                            inst.create_node(obj, {
                                    type: 'page'
                                },
                                'last', function (new_node) {
                                    setTimeout(function () {
                                        inst.edit(new_node);
                                    }, 0);
                                });
                        }
                    },
                };
                return tmp;
            }
        },
        'core': {
            'check_callback': function (operation, node, node_parent, node_position, more) {

                if (operation === 'move_node'){
                    var current_node_site_id = node.parents[node.parents.length - 3]
                    var new_node_site_id = node_parent.type === 'site' ? node_parent.id : node_parent.parents[node_parent.parents.length - 3]

                    if (current_node_site_id !== new_node_site_id){
                        return false;
                    }

                }

                //if (m && m.dnd && m.pos !== 'i') {
                //return false;
                //}

                //if (o === "move_node" || o === "copy_node") {
                //if (this.get_node(n).parent === this.get_node(p).id) {
                //return false;
                //}
                //}

                return true;
            },
            'data': function (node, cb) {

                console.log(node);

                if (node.id === '#') {
                    var endpoint = 'http://local.ucc.edu/wp-json/wp-iab/v1/sites/';

                    $.ajax({
                        url: endpoint,
                        success: function (data) {

                            var network_sites = data.map(function (site) {

                                sites['site-' + site.id] = site;

                                return {
                                    id: 'site-' + site.id,
                                    text: site.title,
                                    children: true,
                                    type: 'site'
                                }
                            });

                            console.log(network_sites);

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
                                    }
                                }
                            );
                        },
                        cache: true
                    });
                } else {

                    if (node.parent === 'root') {
                        var site_id = node.id;
                        var site_path = sites[node.id].path;
                        var endpoint = site_path + '/wp-json/wp/v2/pages/?order=asc&orderby=menu_order&parent=0';
                        console.log(endpoint);
                        $.ajax({
                            url: endpoint,
                            success: function (data) {
                                cb.call(this, data.map(function (post) {
                                    return {
                                        id: site_id + '-' + 'item-' + post.id,
                                        text: post.title.rendered,
                                        children: post.has_children,
                                        type: post.has_children ? 'default' : 'page',
                                        wp_data: {
                                            site_id: site_id,
                                            post_id: post.id
                                        }
                                    }
                                }));
                            },
                            cache: true
                        });
                    } else {
                        var site_id = node.parents[node.parents.length - 3]
                        var site_path = sites[node.parents[node.parents.length - 3]].path;
                        var endpoint = site_path + '/wp-json/wp/v2/pages/?orderby=menu_order&parent=' + node.id.replace(site_id + '-item-', '');
                        console.log(endpoint);
                        $.ajax({
                            url: endpoint,
                            success: function (data) {
                                cb.call(this, data.map(function (post) {
                                    return {
                                        id: site_id + '-item-' + post.id,
                                        text: post.title.rendered,
                                        children: post.has_children,
                                        type: post.has_children ? 'default' : 'page',
                                        wp_data: {
                                            site_id: site_id,
                                            post_id: post.id
                                        }
                                    }
                                }));
                            },
                            cache: true
                        });
                    }

                }
            }
        }
    })
        .on('create_node.jstree', function (e, data) {

            var site_id = data.node.parents[data.node.parents.length - 3]
            var site_path = sites[data.node.parents[data.node.parents.length - 3]].path;

            var parent = data.node.parent === '#' ? 0 : data.node.parent.replace(site_id + '-item-', '');
            console.log('Parent:' + parent);


            var post_data = {
                title: data.node.text,
                excerpt: '',
                content: '',
                status: 'publish',
                parent: parent,
                '_wpnonce': wp_iab_params.nonce

            };

            $.ajax({
                method: 'POST',
                url: site_path + '/wp-json/wp/v2/pages',
                data: post_data,
                success: function (response) {
                    data.instance.set_id(data.node, site_id + '-item-' + response.id);
                },
                fail: function (response) {
                    console.log(response);
                    alert('Failed to create page');
                }
            });

        })
        .on('rename_node.jstree', function (e, data) {
            var site_id = data.node.parents[data.node.parents.length - 3]
            var site_path = sites[data.node.parents[data.node.parents.length - 3]].path;

            var ID = data.node.id.replace(site_id + '-item-', '');

            var post_data = {
                title: data.node.text,
                status: 'publish',
                '_wpnonce': wp_iab_params.nonce

            };

            $.ajax({
                method: 'POST',
                url: site_path + '/wp-json/wp/v2/pages/' + ID,
                data: post_data,
                success: function (response) {
                    data.instance.set_id(data.node, site_id + '-item-' + response.id);
                },
                fail: function (response) {
                    console.log(response);
                    alert('Failed to create page');
                }
            });
        })
        .on('move_node.jstree', function (e, data) {

            var site_id = data.node.parents[data.node.parents.length - 3]
            var site_path = sites[data.node.parents[data.node.parents.length - 3]].path;

            var parent = data.instance.get_node(data.node.parent);
            var parent_wp_id = 0;

            if (parent.type !== 'site') {
                parent_wp_id = parent.id.replace(site_id + '-item-', '');
            }

            for (var i = 0; i < parent.children.length; i++) {
                var child = data.instance.get_node(parent.children[i]);
                var ID = child.id.replace(site_id + '-item-', '');

                var post_data = {
                    parent: parent_wp_id,
                    menu_order: i,
                    '_wpnonce': wp_iab_params.nonce
                }

                $.ajax({
                    method: 'POST',
                    url: site_path + '/wp-json/wp/v2/pages/' + ID,
                    data: post_data,
                    success: function (response) {
                        console.log('Updated');
                    },
                    fail: function (response) {
                        console.log(response);
                    }
                });

            }


        });


    /*
     .on('delete_node.jstree', function (e, data) {
     $.get(wp_iab_params.api_url + '?operation=delete_node', {'id': data.node.id})
     .fail(function () {
     data.instance.refresh();
     });
     })
     .on('create_node.jstree', function (e, data) {
     $.get(wp_iab_params.api_url + '?operation=create_node', {
     'id': data.node.parent,
     'position': data.position,
     'text': data.node.text
     })
     .done(function (d) {
     data.instance.set_id(data.node, d.id);
     })
     .fail(function () {
     data.instance.refresh();
     });
     })
     .on('rename_node.jstree', function (e, data) {
     $.get(wp_iab_params.api_url + '?operation=rename_node', {'id': data.node.id, 'text': data.text})
     .fail(function () {
     data.instance.refresh();
     });
     })
     .on('move_node.jstree', function (e, data) {
     $.get(wp_iab_params.api_url + '?operation=move_node', {
     'id': data.node.id,
     'parent': data.parent,
     'position': data.position
     })
     .fail(function () {
     data.instance.refresh();
     });
     })
     .on('copy_node.jstree', function (e, data) {
     $.get(wp_iab_params.api_url + '?operation=copy_node', {
     'id': data.original.id,
     'parent': data.parent,
     'position': data.position
     })
     .always(function () {
     data.instance.refresh();
     });
     })
     .on('changed.jstree', function (e, data) {

     if (data && data.selected && data.selected.length) {
     $.get(wp_iab_params.api_url + '?operation=get_content&id=' + data.selected.join(':'), function (d) {
     $('#data .default').text(d.content).show();
     });
     }
     else {
     $('#data .content').hide();
     $('#data .default').text('Select a file from the tree.').show();
     }
     });
     */

})(jQuery);