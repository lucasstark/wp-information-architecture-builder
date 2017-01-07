module.exports = {
	'server': [
		'browserSync',
		'watch'
	],
    'build': [
        'clean',
        'copy:main',
        'compress',
        'notify:build'
    ],
};
