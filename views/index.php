<div class="wrap">
	<h1 class="page-title"><?php _e( 'Information Architecture Builder', 'wpiab' ); ?></h1>
	<div class="row">
		<div class="col-6">
			<div class="wpiab-outer-wrap">

				<div class="wpiab-tree-wrap-outer">
					<div id="container" role="main" class="wpiab-tree-wrap-inner">
						<div id="network_browser_tree">
							<ul id="network_browser">
								<li id="root" href="#">Sites</li>
							</ul>
						</div>
						<div id="tree"></div>
					</div>
				</div>


			</div>
		</div>

		<div id="info-container">
			<h2 class="title"><?php _e( 'Properties', 'wpiab' ); ?></h2>

			<div class="inside">


				<div id="info-pane">

				</div>


			</div>

		</div>

	</div>
</div>


<script id="info-pane-template" type="text/template">
	<form>
		<div class="inputs">
			<p>
				<label for="post-title"><?php _e( 'Title', 'wpiab' ); ?></label>
				<input class="title" type="text" width="100%" name="post-title" id="post-title" value="<%= title.rendered %>"/>
			</p>
			<p>
				<span class="post-slug"><strong><?php _e( 'Permalink: ', 'wpiab' ); ?></strong><span id="post-slug-value"><%= link %></span></span>
			</p>
	</form>
	</div>

	<div class="controls">
		<div id="major-publishing-actions">
			<div id="publishing-action">
				<span class="spinner"></span>
				<input name="save" type="submit" class="btn-save button button-primary button-large" id="btn-save" value="<?php _e( 'Save', 'wpapi' ); ?>">
			</div>
			<div class="clear"></div>
		</div>
	</div>
</script>

