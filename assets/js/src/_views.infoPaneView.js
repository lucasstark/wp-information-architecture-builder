;(function ($, WPIAB) {

    /**
     * The view for each page.  Has the title and other fields.
     */
    WPIAB.views.InfoPaneView = Backbone.View.extend({
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

            this.model = model;
            this.treeNode = treeNode;
            this.empty();

            this.$el.html(this.template(this.model.attributes));
            this.$el.find('input.title').eq(0).focus(function () {
                $(this).select();
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

            var siteTreeNode = WPIAB.getSiteTreeNode(this.treeNode);
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

                WPIAB.setLoading(true, domNode);
                this.block();

                this.model.save().done(function () {
                    inst.set_text(self.treeNode, self.model.get('title').rendered);
                    inst.set_icon(self.treeNode, WPIAB.getNodeIcon(self.model));

                    WPIAB.setLoading(false, domNode);
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

})(jQuery, WPIAB);