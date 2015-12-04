/**
 * Main build runner for this project.
 * @usage
 * grunt : compiles site source js and scss
 * grunt --lib : compiles js libraries into single file
 * grunt --build=(cms|site) : runs a different build path
 * grunt watch : compile changed files and livereload
 *
 * @author Mike Adamczyk <mike@bom.us>
 * @param grunt
 */
var BuildConfig = require ('./buildconf.js');

module.exports = function(grunt) {

    // Select which build.json configuration to use.
    // By Default, uses the site configuration.
    var build = BuildConfig.create (grunt.option('build') || "site", grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Prefixes the given files.
        autoprefixer: build.prefixer(),

        // Joins the given files into one file.
        concat:{
            options: {separator:";\n"},
            source: {
                dest: build.concat('src'),
                src:  build.source('src')
            },
            library: {
                dest: build.concat('lib'),
                src:  build.source('lib')
            }
        },

        // Runs compass compile.
        compass: build.compass(),

        // Watches JS, SCSS and HTML pages for changes.
        // Fires livereload in the browser.
        watch: {
            scripts: {
                files: build.source(),
                tasks: ['concat:source'],
                options: {spawn:false, livereload:true}
            },
            scss: {
                files: [build.resourcePath("*/*.scss")],
                tasks: ['compass'],
                options: {spawn:false, livereload:true}
            },
            blade: {
                files: [build.resourcePath("views/*.php")],
                options: {livereload:true}
            }
        }
    });


    // Node modules to load.
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // To run grunt, type "grunt" at the command line in this directory.
    grunt.registerTask('default', [
        'compass',
        'autoprefixer',
        (grunt.option('lib') ? 'concat:library' : "concat:source")
    ]);

};