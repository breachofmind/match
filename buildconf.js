/**
 * Build configuration class.
 * @param name string from build.json
 * @constructor
 */
var conf = function BuildConf (name, grunt)
{
    var build = this;
    var contents = grunt.file.readJSON('build.json');

    /**
     * Setup a new configuration.
     * @param name
     */
    this.setConfig = function(name)
    {
        this.config = contents[name];
        this.name = contents[name].name;
        this.description = contents[name].description;
    };

    /**
     * Return the resource path.
     * @param path string optional
     * @returns {BuildConf.resourcePath|*}
     */
    this.resourcePath = function(path)
    {
        return path ? this.config.resourcePath+path : this.config.resourcePath;
    };

    /**
     * Return the build path.
     * @param path string optional
     * @returns {string}
     */
    this.path = function(path)
    {
        return path ? this.config.buildPath+path : this.config.buildPath;
    };

    /**
     * Return the source JS files.
     * @param type string
     * @returns {array}
     */
    this.source = function(type)
    {
        var files = [];
        var source = this.config[type ? type : 'src'];
        for(var i=0; i<source.length; i++) {
            files.push( this.resourcePath("js/"+source[i]) );
        }
        return files;
    };

    /**
     * Return the concat filename for the source JS file.
     * @returns {string}
     */
    this.concat = function(type)
    {
        if (!type) type = "src";
        return this.path(this.name + "." + type + ".js");
    };

    /**
     * Return the autoprefixer option.
     * @returns {{}}
     */
    this.prefixer = function()
    {
        var prefix = {};
        var files = this.config.css;
        for (var i=0; i<files.length; i++) {
            var name = this.path(files[i]);
            prefix[name] = name;
        }
        return prefix;
    };

    /**
     * Compass options.
     * @returns {object}
     */
    this.compass = function()
    {
        return {dist: {
            options: {
                sassDir: this.resourcePath('scss/'),
                cssDir:  this.path(),
                importPath: this.config.importPath || null
            }}}
    };

    this.setConfig(name);
};

conf.create = function(name,grunt)
{
    return new conf(name,grunt);
};

module.exports = conf;