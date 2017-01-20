;(function ($, WPIAB) {

    WPIAB.load_data = function (node, cb) {
            var treeInstance = this;

            //This is the root node from jstree.  Here we want to use the sites collection, loaded in rootData.sitesCollection on initial page load.
            //Create a tree node for each Site model. This gives us the first level of the tree.
            if (node.id === '#') {
                network_sites = [];
                //Loop though each Site model and create a jstree node
                WPIAB.rootData.sitesCollection.each(function (site) {
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

                        node.data.api.models = WPIAB.rootData.models;//Keep a reference to the models, not used but here for future use.
                        node.data.api.collections = WPIAB.rootData.collections;//Keep a reference to the collections, not used but here for future use.
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
                                        icon: WPIAB.getNodeIcon(node.data.pages.get(post.id)),
                                        data: {
                                            model: node.data.pages.get(post.id),
                                        }
                                    };
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
                                            icon: WPIAB.getNodeIcon(node.data.pages.get(post.id)),
                                            data: {
                                                model: node.data.pages.get(post.id),
                                            }
                                        };
                                    })
                                );
                            });

                        });
                    }
                } else {
                    //Get the nodes parent site node.
                    //The site node has a reference to the collection for it's pages.
                    var siteTreeNode = WPIAB.getSiteTreeNode(node);

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
                                icon: WPIAB.getNodeIcon(siteTreeNode.data.pages.get(post.id)),
                                data: {
                                    //Set the treenode's data.model property to the actual page model.
                                    model: siteTreeNode.data.pages.get(post.id),
                                }
                            };
                        }));
                    });
                }

            }
        };

})(jQuery, WPIAB);