<?php //TODO:  Clean up this markup as much as possible ?>
<div class="wrap" id="application_root">
    <h1 class="page-title"><?php _e( 'Information Architecture Builder', 'wpiab' ); ?></h1>
    <div class="row">
        <div class="col-6">
            <div class="wpiab-outer-wrap">

                <div class="wpiab-tree-wrap-outer">
                    <div id="container" role="main" class="wpiab-tree-wrap-inner info-container  ">
                        <h2 class="title"><?php _e( 'Site Structure', 'wpiab' ); ?></h2>
                        <div class="loading-wrapper">
                            <div class="loading visually-hidden">
                                <i class="loading-icon fa fa-circle-o fa-fw"></i>
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <div class="network_browser_tree_container">
                            <div id="network_browser_tree">
                                <ul id="network_browser"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-containers">

            <div id="info-container" class="info-container ">
                <h2 class="title"><?php _e( 'Page Information', 'wpiab' ); ?></h2>
                <div class="loading-wrapper">
                    <div class="loading visually-hidden">
                        <i class="loading-icon fa fa-circle-o fa-fw"></i>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <div class="inside blockable">
                    <div id="info-pane">
                    </div>
                </div>

            </div>

            <div id="site-info-container" class="info-container">
                <h2 class="title"><?php _e( 'Site Information', 'wpiab' ); ?></h2>
                <div class="loading-wrapper">
                    <div class="loading visually-hidden">
                        <i class="loading-icon fa fa-circle-o fa-fw"></i>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <div class="inside blockable">
                    <div id="site-info-pane">
                        <div class="site-info-plot" style="width:400px;height:400px;"></div>
                        <div class="site-info-content"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<?php
//The script template for the Page Information
wpiab()->templates->get_template('script-views/info-pane.php');
?>

<?php
//The script template for the Site Information
wpiab()->templates->get_template('script-views/site-info-pane.php');
?>

