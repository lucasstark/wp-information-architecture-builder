;(function ($, wp) {

    /**
     * The view for each page.  Has the title and other fields.
     */
    wp.jstree.views.ItemView = Backbone.View.extend({
        treeNode: {},
        //Template is in views/index.php
        template: _.template($('#info-pane-template').length ? $('#info-pane-template').html() : ''),
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

            _.bindAll(this, 'onModelChange', 'onSave', 'onDelete', 'onCancel', 'updateModel', 'saveModel', 'switchNode');
        },
        empty: function () {
            this.$content.empty();
        },
        switchNode: function (treeNode) {
            if (this.model) {
                this.stopListening(this.model);
            }

            this.model = treeNode.data.model;

            this.listenTo(this.model, 'change', this.onModelChange);

            this.treeNode = treeNode;
            this.empty();
            var editUrl = this.treeNode.data.getApi().model.get('url') + '/wp-admin/post.php?post=' + this.model.get('id') + '&action=edit';
            var attributes = _.extend( { editUrl: editUrl }, this.model.attributes );
            this.$content.html(this.template( attributes ) );
        },
        onModelChange: function (model) {
            this.$el.find('input.title').eq(0).val(model.get('title').rendered);
            this.$el.find('#post-slug-value').eq(0).text(model.get('link'));
        },
        onSave: function (e) {
            e.preventDefault();
            this.saveModel(e);
        },
        onDelete: function (e) {
            e.preventDefault();
        },
        onCancel: function (e) {
            e.preventDefault();
        },
        //Updates the model properties but does not sync it with the server.
        updateModel: function (e) {
            var updateRequired = false;

            var api = this.treeNode.data.getApi();//get the SiteNode ( the api ) attached to the treeNode.
            var siteModel = api.model;//The model for the site ( api ) itself, comes from the Sites() collection.

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
        saveModel: function (e) {
            var self = this;
            var updateRequired = this.updateModel();
            if (updateRequired) {
                var self = this;

                var inst = $.jstree.reference(this.treeNode);
                var domNode = inst.get_node(this.treeNode, true);

                wp.jstree.ui.setLoading(true, domNode);
                this.block();

                this.model.save().done(function () {
                    self.$el.find('input.title').eq(0).val(self.model.get('title').rendered);
                    self.$el.find('#post-slug-value').eq(0).text(self.model.get('link'));
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