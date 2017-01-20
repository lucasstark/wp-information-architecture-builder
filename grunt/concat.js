module.exports = {
	/**
	 * grunt-contrib-concat
	 *
	 * Concatenate files.
	 *
	 * Concatenates an array of js files set in /grunt/vars.js
	 *
	 * @link https://www.npmjs.com/package/grunt-contrib-concat
	 */
	options: {
		stripBanners: true,
		banner: '/*! <%= package.title %>\n' +
		' * <%= package.homepage %>\n' +
		' * Copyright (c) <%= grunt.template.today("yyyy") %>;\n' +
		' * Licensed GPLv2+\n' +
		' */\n'
	},

	deps: {
		src: [
            'assets/js/src/_schema.js',
            'assets/js/src/_init.js',
            'assets/js/src/_views.infoPaneView.js',
			'assets/js/src/_views.siteInfoPaneView.js',
			'assets/js/src/_jstree.create_node.js',
            'assets/js/src/_jstree.data.js',
            'assets/js/src/_jstree.move_node.js',
            'assets/js/src/_jstree.node_changed.js',
            'assets/js/src/_jstree.rename_node.js',
			'assets/js/src/main.js'
		],
		dest: 'assets/js/main.js'
	}
};
