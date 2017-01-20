;(function ($, WPIAB) {
    WPIAB.node_changed = function (e, data) {

        if (data && data.selected && data.selected.length === 1 && (data.node.type == 'page' || data.node.type == 'default')) {
            var site_id = data.node.data.model.get('site_id');
            WPIAB.App.switchView(data.node.data.model, data.node);
        } else if (data && data.selected && data.selected.length === 1 && data.node.type === 'site') {
            WPIAB.App.switchView(data.node.data.model, data.node);
        }


    };
})(jQuery, WPIAB);