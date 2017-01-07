<script id="info-pane-template" type="text/template">
	<form>
		<div class="inputs">
			<p>
				<label for="post-title"><?php _e( 'Title', 'wpiab' ); ?></label>
				<input class="title" type="text" width="100%" name="post-title" id="post-title"
				       value="<%= title.rendered %>"/>
			</p>
			<p>
                <span class="post-slug"><strong><?php _e( 'Permalink: ', 'wpiab' ); ?></strong><span
		                id="post-slug-value"><%= link %></span></span>
			</p>
			<p>
				<label for="migration-notes"><?php _e( 'Migration Notes', 'wpiab' ); ?></label>
				<textarea class="wpiab-full-width" id="migration-notes" name="migration-notes" rows="4"><%- migration_notes %></textarea>
			</p>
			<p>
				<label for="migration-old-url"><?php _e( 'Previous URL', 'wpiab' ); ?></label>
				<input class="" type="text" width="100%" name="migration-old-url" id="migration-old-url"
				       value="<%= migration_old_url %>"/>
			</p>
			<p>
				<label for="migration-status"><?php _e( 'Migration Status', 'wpiab' ); ?></label>
				<select name="migration-status" id="migration-status">
					<option
					<% if(!migration_status || migration_status === 'new') { %> selected="selected" <% } %>
					value="new"><?php _e( 'New', 'wpiab' ); ?></option>
					<option
					<% if(migration_status === 'in_progress') { %> selected="selected" <% } %>
					value="in_progress"><?php _e( 'In Progress', 'wpiab' ); ?></option>
					<option
					<% if(migration_status === 'in_review') { %> selected="selected" <% } %>
					value="in_review"><?php _e( 'Needs Review', 'wpiab' ); ?></option>
					<option
					<% if(migration_status === 'complete') { %> selected="selected" <% } %>
					value="complete"><?php _e( 'Complete', 'wpiab' ); ?></option>
				</select>
			</p>
		</div>
	</form>

	<div class="controls">
		<div id="major-publishing-actions">
			<div id="publishing-action">
				<span class="spinner"></span>
				<input name="save" type="submit" class="btn-save button button-primary button-large" id="btn-save"
				       value="<?php _e( 'Save', 'wpapi' ); ?>">
			</div>
			<div class="clear"></div>
		</div>
	</div>
</script>