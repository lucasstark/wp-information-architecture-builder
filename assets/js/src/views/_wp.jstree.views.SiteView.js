;(function($, wp){
    //Contains the chart for the site information.
    wp.jstree.views.SiteView = Backbone.View.extend({
        //Template is in views/index.php
        template: _.template($('#site-info-pane-template').html()),
        initialize: function () {
            _.bindAll(this, "render", 'addPage', 'removePage');
            this.$plot = this.$el.find('.site-info-plot').eq(0);
            this.$content = this.$el.find('.site-info-content').eq(0);
            console.log(this.$el.html())

        },
        switchNode: function (treeNode) {

            if (this.model) {
                this.stopListening(this.model);
            }

            if (this.collection) {
                this.stopListening(this.collection);
            }

            var endpoint = treeNode.data.getEndpoint();
            this.model = endpoint.siteNode.model;
            this.collection = endpoint.collection;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.collection, 'add', this.addPage);
            this.listenTo(this.collection, 'remove', this.removePage);
            this.render(this.model);
        },
        //Renders the pie chart.
        render: function (model) {
            //Get's called when any of the models properties change and when an item is added or removed from the pages collection.

            this.block();

            //this.$content.empty();
            //this.$content.html(this.template(this.model.toJSON()));

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
            var count = this.model.get('migration_status_' + pageModel.get('migration_status'));
            this.model.set('migration_status_' + pageModel.get('migration_status'), count + 1);
        },
        removePage: function (pageModel) {
            //When an item is removed from the sites pages collection.
            //Update the status counts on this views model, which is a Site model.
            var count = this.model.get('migration_status_' + pageModel.get('migration_status'));
            this.model.set('migration_status_' + pageModel.get('migration_status'), count - 1);
        }
    });
    
})(jQuery, wp);