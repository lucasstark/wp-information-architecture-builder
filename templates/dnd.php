<div class="wrap">

    <section id="dropzoneId" class="wp-iab-add-pages-view-wrap">

    </section>

</div>


<script type="text/javascript">


    (function ($) {

        $(document).ready(function () {
            var view = new wp.jstree.views.AddItemsView();
            $('#dropzoneId').append( view.render().el );
        });

    })(jQuery);

</script>