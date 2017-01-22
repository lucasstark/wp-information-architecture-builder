module.exports = {
    'default': [
        'styles',
        'scripts',
        'makepot',
        'notify:default'
    ],
	'server': [
		'browserSync',
		'watch'
	],
    'scripts': [
        'concat',
        'notify:scripts'
    ],
    'build': [
        'clean',
        'scripts',
        'copy:main',
        'compress',
        'notify:build'
    ],
};
