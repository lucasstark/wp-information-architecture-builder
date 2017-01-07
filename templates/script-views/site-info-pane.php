<script id="site-info-pane-template" type="text/template">


	<div class="site-info-content-block bg-new">
		<span class="label"><?php _e( 'Not Started:', 'wpiab' ); ?></span> <%= migration_status_new %>
	</div>
	<div class="site-info-content-block bg-in-progress">
		<span class="label"><?php _e( 'In Progress:', 'wpiab' ); ?></span> <%= migration_status_in_progress %>
	</div>
	<div class="site-info-content-block bg-in-review">
		<span class="label"><?php _e( 'In Review:', 'wpiab' ); ?></span> <%= migration_status_in_review %>
	</div>
	<div class="site-info-content-block bg-complete ">
		<span class="label"><?php _e( 'Complete:', 'wpiab' ); ?></span> <%= migration_status_complete %>
	</div>

</script>