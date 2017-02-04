;(function ($, wp) {

    /**
     * The view for each page.  Has the title and other fields.
     */
    wp.jstree.views.AddItemsView = Backbone.View.extend({
        tagName: 'div',
        className: 'wp-iab-add-items-view wp-iab-drop-target',
        initialize: function (parentModel) {
            var self = this;

            ;

            window.addEventListener("dragenter", function (e) {
                e.preventDefault();
                if (e.target !== self.$elDropTarget[0]) {
                    e.dataTransfer.effectAllowed = "none";
                    e.dataTransfer.dropEffect = "none";
                }
            }, false);

            window.addEventListener("dragover", function (e) {
                e.preventDefault();
                if (e.target !== self.$elDropTarget[0]) {
                    e.dataTransfer.effectAllowed = "none";
                    e.dataTransfer.dropEffect = "none";
                }
            });

            window.addEventListener("drop", function (e) {
                e.preventDefault();
                if (e.target !== self.$elDropTarget[0]) {
                    e.dataTransfer.effectAllowed = "none";
                    e.dataTransfer.dropEffect = "none";
                } else {
                    self.onDrop(e);
                }
            });

            this.collection = new Backbone.Collection();

            this.listenTo(this.collection, 'add', this.onItemAdded);
            this.listenTo(this.collection, 'remove', this.onItemRemoved);



            _.bindAll(this, 'onItemAdded', 'onItemRemoved');

        },
        render: function () {
            this.$el.append('<div class="wp-iab-drop-target"></div>');
            this.$el.append('<div class="wp-iab-items-list-wrap"><ul class="wp-iab-items-list"></ul></div>');

            this.$elDropTarget = this.$el.find('.wp-iab-drop-target');
            this.$elList = this.$el.find('.wp-iab-items-list');

            return this;
        },
        onDrop: function (e) {
            var title = e.dataTransfer.getData('text');

            this.collection.add({
                title: {
                    rendered: title,
                    raw: title
                }
            });
        },
        onItemAdded: function (item) {
            this.$elList.append('<li id="wp-iab-add-items-list-item-' + item.cId + '">' + item.get('title').rendered + '</li>');
        },

        onItemRemoved: function (item) {

        },
        block: function () {
            //From blockui
            this.$el.block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });
        },
        unblock: function () {
            //From blockui
            this.$el.unblock();
        }
    });


})(jQuery, wp);