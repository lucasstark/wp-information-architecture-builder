(function ($) {

    var app = {
        views: {},
        tree: {},
        jsonRoot: 'wp-json/'
    };

    var NetworkView = Backbone.View.extend({
        initialize: function () {
            var self = this;
            /*
             app.tree = $(this.el).jstree({
             "plugins": [
             "types", "contextmenu", "dnd",
             ],
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
             'core': {
             'check_callback': true,
             'multiple': false,
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
             }
             }).on('changed.jstree', function (e, data) {
             console.log('Changed');
             self._onSelected(e, data);
             }).on('loading.jstree', function (e, data) {
             console.log('Loading');
             self._onBeforeOpened(e, data);
             }).on('load_node.jstree', function (e, data) {
             console.log('Load Node');
             self._onBeforeOpened(e, data);
             });

             */

            // bind the functions 'add' and 'remove' to the view.
            _(this).bindAll('add', 'remove', 'onSiteLoaded');

            this._nodes = {};
            this.collection.each(this.add);

            // bind this view to the add and remove events of the collection!
            this.collection.bind('add', this.add);
            //this.collection.bind('remove', this.remove);
        },

        render: function () {
            this._rendered = true;
            return this;
        },
        add: function (site) {
            var node = new SiteView({
                model: site,
            });

            this.$el.append(node.render().el);
            //node.bind('siteLoaded', this.onSiteLoaded);
        },
        onSiteLoaded: function (view) {
            console.log('onSiteLoaded');
            this._nodes[view.node_id] = view;
        },
        _onSelected: function (e, data) {
            if (data && data.selected && data.selected.length === 1 && (data.node.type == 'page' || data.node.type == 'default')) {

            }
            else {

            }
        },
        _onBeforeOpened: function (e, data) {
            if (data.node.type === 'site') {
                this._nodes[data.node.id].collection.fetch({
                    merge: true, silent: false, add: true, remove: false,
                    data: {
                        'orderby': 'menu_order',
                        'order': 'asc',
                        'parent': 0
                    }
                });
            }
        }
    });

    var SiteView = Backbone.View.extend({
        node_id: '',
        tagName: 'li',
        events: {
            'click a': 'loadNode'
        },
        initialize: function (options) {
            this._nodes = [];
            var self = this;
            this.children = $('<ul></ul>');

            // bind the functions 'add' and 'remove' to the view.
            _(this).bindAll('add');



            wp.api.init({
                apiRoot: this.model.get('url') + '/' + app.jsonRoot + '/'
            }).done(function () {
                self.models = _.extend({}, this.models);
                self.collections = _.extend({}, this.collections);
                self.collection = new self.collections.Pages();
                self.collection.bind('add', self.add);
                self.render();
            });
        },
        render: function () {
            /*
             this.node_id = app.tree.jstree('create_node', 'root', {
             id: 'site-' + this.model.id,
             text: this.model.get('title'),
             children: true,
             type: 'site',
             });
             this.trigger('siteLoaded', this);
             */

            this.$el.empty();
            this.$el.html('<a href="#">' + this.model.get('title') + '</a>');
            this.$el.append(this.children);
            return this;
        },
        add: function (page) {
            /*
             app.tree.jstree('create_node', this.node_id, {
             id: 'site-' + this.model.id + '-page-' + page.id,
             text: page.get('title'),
             children: page.has_children,
             type: page.has_children ? 'default' : 'page',
             });
             */

            var pageView = new PageView({
                model: page,
                collection: this.collection
            });

            this.children.append(pageView.render().el);

        },
        loadNode: function (e) {
            e.preventDefault();
            this.collection.fetch({
                merge: true, silent: false, add: true, remove: false,
                data: {
                    'orderby': 'menu_order',
                    'order': 'asc',
                    'parent': 0
                }
            });

        }
    });


    var PageView = Backbone.View.extend({
        tagName: 'li',
        initialize: function (options) {
            this._nodes = [];
        },
        render: function () {
            this.$el.html('<a href="#">' + this.model.get('title').rendered + '</a>');
            return this;
        }
    });


    var sites = [];
    var rootData = {};

    wp.api.init({
        apiRoot: 'http://local.ucc.edu/wp-json/'
    }).done(function () {

        app.views.networkBrowser = new NetworkView({
            types: {
                models: _.extend({}, this.models),
                collections: _.extend({}, this.collections)
            },
            collection: new this.collections.Sites(),
            el: '#network_browser'
        });

        app.views.networkBrowser.collection.fetch({data: {per_page: 0}}).done(function () {
        });
    });

})(jQuery);
