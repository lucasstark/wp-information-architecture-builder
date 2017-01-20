;(function (global, $) {

    global.WPIAB = {
        App: {},
        views: {}
    };


    var WPArchitectureBuilder = function() {
        return new WPArchitectureBuilder.init();
    };

    WPArchitectureBuilder.prototype = {};

    WPArchitectureBuilder.init = function() {
        var self = this;
        self.rootData = {};
    };

    WPArchitectureBuilder.init.prototype = WPArchitectureBuilder.prototype;

    global.WPIAB.builder = WPArchitectureBuilder;


    WPIAB.getSiteTreeNode = function (node) {
        var parent = WPIAB.App.tree.jstree('get_node', node.parents[node.parents.length - 3]);
        return parent;
    };

    WPIAB.setLoading = function (loading, domNode) {
        if (loading) {
            if (domNode) {
                domNode.addClass("jstree-loading").attr('aria-busy', true);
            }

            $('.loading-icon').removeClass('fa-circle-o').addClass('fa-circle-o-notch fa-spin');

            $('#network_browser_tree').block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });

            //WPIAB.App.siteInfoPane.block();

        } else {
            if (domNode) {
                domNode.removeClass("jstree-loading").attr('aria-busy', false);
            }
            //WPIAB.App.siteInfoPane.unblock();

            $('#network_browser_tree').unblock();
            $('.loading-icon').removeClass('fa-circle-o-notch fa-spin').addClass('fa-circle-o');
        }
    };

    WPIAB.getNodeIcon = function (pageModel) {
        var icon = 'glyph-icon fa ' + (pageModel.get('has_children') ? 'fa-folder' : 'fa-file');
        var iconColor = '';
        switch (pageModel.get('migration_status')) {
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

    };

})(window, jQuery);
