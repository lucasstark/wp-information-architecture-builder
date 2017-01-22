;(function ($, wp) {

    //TODO:  Move this into the main AppView

    /**
     * Toggle loading state for the treeNode spinner and other views.
     * @param loading
     * @param domNode
     */
    wp.jstree.ui.setLoading = function (loading, domNode) {
        if (loading) {
            if (domNode) {
                domNode.addClass("jstree-loading").attr('aria-busy', true);
            }

            $('.loading-icon').removeClass('fa-circle-o').addClass('fa-circle-o-notch fa-spin').attr('aria-busy', true);

            $('.network_browser_tree').block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });

            //App.siteInfoPane.block();

        } else {
            if (domNode) {
                domNode.removeClass("jstree-loading").attr('aria-busy', false);
            }
            //App.siteInfoPane.unblock();

            $('.network_browser_tree').unblock();
            $('.loading-icon').removeClass('fa-circle-o-notch fa-spin').addClass('fa-circle-o').attr('aria-busy', false);
        }
    }

})(jQuery, wp)