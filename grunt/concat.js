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
            'assets/js/src/_init.js',
            'assets/js/src/_wp.jstree.utils.js',
            'assets/js/src/_wp.jstree.ui.js',
            'assets/js/src/nodes/_wp.jstree.ItemNode.js',
            'assets/js/src/nodes/_wp.jstree.SiteNode.js',
            'assets/js/src/nodes/_wp.jstree.NetworkNode.js',
			'assets/js/src/views/_wp.jstree.views.ItemView.js',
            'assets/js/src/views/_wp.jstree.views.SiteView.js',
			'assets/js/src/main.js'
		],
		dest: 'assets/js/main.js'
	}
};
