module.exports = function (grunt) {

	/**
	 * These are the files that will be used with the "nodemcu-uploader.py" to upload to the ESP8266
	 * TODO:// This should maybe be more dynamic?
	 * @type {string[]}
	 */
	var httpFiles = [
		// CSS Files
		"http/main.css", "http/gd.css",

		// LUA Scripts
		"http/args.lua",  "http/ni.lua", "http/fl.lua", "http/gd.lua", "http/test.lua",

		// HTML FILES
		"http/garage-door.html", "http/post.html" , "http/index.html",

		// MISC
		"http/favicon.ico"
	];

	/**
	 * These are the core files required by the ESP8266
	 * @type {string[]}
	 */
	var files = ["init.lua", "httpserver.lua","httpserver-request.lua", "httpserver-static.lua", "httpserver-header.lua", "httpserver-error.lua"
	];

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/* This is the COM port that will be used to upload lua files to the ESP8266. */
		comPort: 'COM11',

		luaFiles: files.join(' '),

		htmlFiles: httpFiles.join(' '),

		shell: {
			options: {
				stderr: false
			},
			cpMain: {
				command:[
					'cd build',
					'echo nodemcu-uploader.py -b 9600 -p <%= comPort %> upload <%= luaFiles %>'
				].join('&&'),
				//command:  'nodemcu-uploader.py -b 9600 -p <%= comPort %> upload <%= luaFiles %>',

				//command: function() {
				//	return 'echo ./build/nodemcu-uploader.py -b 9600 -p <%= comPort %> upload <%= luaFiles %>';
				//},
				options: {
					stderr: true
					//execOptions: {
					//	cwd: 'build'
					//}
				}
			},
			cpHtml: {
				command:[
					'cd build',
					'echo nodemcu-uploader.py -b 9600 -p <%= comPort %> upload <%= htmlFiles %>'
				].join('&&'),
				//command: function() {
				//	return 'echo ./build/nodemcu-uploader.py -b 9600 -p <%= comPort %> upload <%= htmlFiles %>';
				//},
				options: {
					stderr: false
					//execOptions: {
					//	cwd: 'build/html'
					//}
				}
			}
			//copyFiles: {
			//	command: 'nodemcu-uploader.py -b 9600 -p <%= comPort %> upload <%= luaFiles %>'
			//}
		},

		less: {
			main: {
				files: {
					"http/main.css": "http/main.less",
					"http/gd.css": "http/gd.less"
				}
			}
		},

		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'http',
					src: ['*.css', '!*.min.css'],
					dest: 'build/http',
					ext: '.css'
				}]
			}
		},

		htmlmin: {                                     // Task
			dist: {                                      // Target
				options: {                                 // Target options
					removeComments: true,
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
					removeRedundantAttributes: true,
					removeOptionalTags: true,
					minifyCSS: true,
					minifyJS: true
				},
				files: {                                   // Dictionary of files
					'build/http/post.html': 'http/post.html',
					'build/http/index.html': 'http/index.html',
					'build/http/garage-door.html': 'http/garage-door.html'
				}
			}
		},

		copy: {
			main: {
				files: [
					// flattens results to a single level
					{expand: true, flatten: true, src: ['http/*.lua', 'nodemcu-uploader.py', 'http/favicon.ico'], dest: './build/http/'},
					{expand: true, flatten: true, src: ['*.lua', '*.py'], dest: './build/', filter: 'isFile'}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-shell');

	// Default task(s).
	grunt.registerTask('default', ['htmlmin', 'less']);

	grunt.registerTask('ugl', ['uglify']);

	grunt.registerTask('compileless', ['less']);

	grunt.registerTask('build', ['htmlmin', 'less', 'cssmin', 'copy']);

};