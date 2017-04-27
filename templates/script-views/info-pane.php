<script id="info-pane-template" type="text/template">



	<form>
		<div class="inputs">
			<p>
				<label for="post-title"><?php _e( 'Title', 'wpiab' ); ?></label>
				<input class="title" type="text" width="100%" name="post-title" id="post-title"
				       value="<%= title.rendered %>"/>
			</p>
			<p>
                <span class="post-slug"><strong><?php _e( 'Permalink: ', 'wpiab' ); ?></strong><a href="<%= link %>" id="post-slug-value"><%= link %></a></span>
			</p>


            <p>
                <label for="migration-source-id"><?php _e( 'Previous ID', 'wpiab' ); ?></label>
                <input class="" type="number" width="10%" name="migrate-source-id" id="migrate-source-id" value="<%= migrate_source_id %>"/>
            </p>

			<p>
				<label for="migration-old-url"><?php _e( 'Previous URL', 'wpiab' ); ?></label>
				<input class="" type="text" width="100%" name="migration-old-url" id="migration-old-url"
				       value="<%= migration_old_url %>"/>
			</p>
            <p>
                <span class="post-slug"><strong><?php _e( 'Existing URL: ', 'wpiab' ); ?></strong><a target="_blank" href="<%= migration_old_url %>" id="migration-old-url-link"><%= migration_old_url %></a></span>
            </p>
			<p>
				<label for="migration-status"><?php _e( 'Status', 'wpiab' ); ?></label>
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
            <p>
                <label for="migration-notes"><?php _e( 'Notes', 'wpiab' ); ?></label>
                <textarea class="wpiab-full-width" id="migration-notes" name="migration-notes" rows="4"><%- migration_notes %></textarea>
            </p>
		</div>
	</form>

	<div class="controls">
		<div id="major-publishing-actions">
            <div class="editing-action">
                <a target="_blank" name="edit" class="btn-edit button button-secondary button-large" href="<%= editUrl %>" id="btn-edit"><%= wp_iab_params.labels.edit %></a>
            </div>
			<div id="publishing-action">
				<span class="spinner"></span>
				<input name="save" type="submit" class="btn-save button button-primary button-large" id="btn-save"
				       value="<?php _e( 'Save', 'wpapi' ); ?>">
			</div>
			<div class="clear"></div>
		</div>
	</div>
</script>
