;(function ($, wp) {

    //TODO:  Move this into the main AppView

    /**
     * Toggle loading state for the treeNode spinner and other views.
     * @param loading
     * @param domNode
     */
    wp.jstree.ui.setLoading = function (loading, domNode) {
        if (loading) {

            $('.blockable').block({
                message: null,
                overlayCSS: {
                    background: '#000',
                    opacity: 0.2
                }
            });

            if (domNode) {
                domNode.addClass("jstree-loading").attr('aria-busy', true);
            }

            $('.loading-icon').removeClass('fa-circle-o').addClass('fa-circle-o-notch fa-spin').attr('aria-busy', true);

        } else {
            $('.blockable').unblock();
            if (domNode) {
                domNode.removeClass("jstree-loading").attr('aria-busy', false);
            }

            $('.loading-icon').removeClass('fa-circle-o-notch fa-spin').addClass('fa-circle-o').attr('aria-busy', false);
        }
    }

})(jQuery, wp)