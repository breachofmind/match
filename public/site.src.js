/**
 * Enhance the trim() method to include a character mask.
 * @param chr string
 */
String.prototype.trimMask = function (chr) {
    if (typeof chr=="undefined") {
        return this.trim();
    }

    return this.replace(new RegExp("^["+chr+"]+|["+chr+"]+$","g"), "");
};

/**
 * Convert a string to a url slug, replacing spaces with dashes and lowercase.
 * @returns {string}
 */
String.prototype.toSlug = function() {
    return this
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
};

function str_slug (string) {
    if (!string || string=="") {
        return string;
    }
    return string.toSlug();
}


function URL (url) {

    // Instance.
    var self = this;

    this.parameters = {};
    this.pathname = null;
    this.href = null;
    this.hostname = null;
    this.origin = null;
    this.port = null;
    this.protocol = null;
    this.hash = null;

    parse(url);

    this.pathname = this.pathname.trimMask('/');

    /**
     * Return the segments or segment.
     * This is a 1 based index, like Laravel.
     * @param n Number optional
     * @returns {array|string|null}
     */
    this.segment = function(n)
    {
        var parts = this.pathname.split("/");
        if (n && n>0) {
            return parts[n-1] ? parts[n-1] : null;
        }
        return parts;
    };

    /**
     * Set a query parameter.
     * @param key string|object
     * @param value string
     * @returns {birdmin.URL}
     */
    this.setParameter = function (key,value)
    {
        if (key instanceof 'object') {
            for (var prop in key) {
                this.parameters[key] = value;
            }
        } else {
            this.parameters[key] = value;
        }
        return this;
    };

    /**
     * Get a parameter.
     * @param key string
     * @returns {string|null}
     */
    this.getParameter = function(key)
    {
        if (!this.parameters[key]) {
            return null;
        }
        return this.parameters[key];
    };

    /**
     * Check if the given segment equals the value.
     * @param n Number
     * @param value string
     * @returns {boolean}
     */
    this.isSegment = function(n, value)
    {
        return this.segment(n) == value;
    };

    /**
     * Check if the URL path contains the given string.
     * @param string
     * @returns {boolean}
     */
    this.has = function(string)
    {
        return this.getUrl().search(string) > -1;
    };

    /**
     * Check if the given relative url string segments are present in this url.
     * @param string string - like /cms/pages/edit
     * @returns {boolean}
     */
    this.hasSegments = function(string)
    {
        var segments = string.trimMask("/").split("/");
        var hasThem = true;
        for (var i=0; i<segments.length; i++) {
            if (segments[i] != this.segment(i+1)) {
                hasThem = false;
                break;
            }
        }
        return hasThem;
    };

    /**
     * Return the base URL string of the application.
     * @returns {string}
     */
    this.getBaseUrl = function()
    {
        return [this.protocol+"/", this.host].join("/") + "/";
    };

    /**
     * Return the complete url.
     * @returns {*}
     */
    this.getUrl = function()
    {
        return this.getBaseUrl()+this.pathname+($.param(this.parameters));
    };


    /**
     * Parse the incoming url.
     * @param url
     */
    function parse(url)
    {
        // Hack parses URL string into components.
        var loc = document.createElement("a");
        loc.href = url;

        // Generate the url parts.
        var parts = ['pathname','href','hostname','host','origin','port','protocol','hash'];
        parts.forEach(function(part) {
            self[part] = loc[part] || null;
        });

        // Parse query string.
        if (loc.search!="") {
            var search = loc.search.substring(1);

            var pairs = search.split("&");
            for (var i=0; i<pairs.length; i++) {
                var keyval = pairs[i].split("=");
                self.parameters[keyval[0]] = keyval[1];
            }
        }
    }

}

URL.prototype.toString = function() {
    return this.getUrl();
};
;
'use strict';

var app = {
    images: [
    // Images to use.
        '/public/images/icon_phone-1.svg',
        '/public/images/icon_phone-2.svg',
        '/public/images/icon_phone-3.svg',
        '/public/images/icon_phone-4.svg',
        '/public/images/icon_phone-5.svg',
        '/public/images/icon_phone-6.svg'
    ]
};

/**
 * Angular code
 */
var game = angular.module('memorygame', ['ngSanitize'])
    .controller('GameCtrl', ['$scope','$timeout', function ($scope,$timeout) {

        var game = this;

        game.board = app.GamePieceCollection.create();

        var selections = [];

        // Number of tries by the user.
        this.tries = 0;

        // Is the game solved yet?
        this.solved = false;

        this.accuracy = function()
        {
            var count = app.images.length;
            var tries = game.tries;
            var matches = game.board.matches;
            if (!tries) return "-";
            return (matches/tries * 100).toFixed(2)+"%";
        };

        /**
         * What happens when you select a game piece?
         * @param piece {app.GamePiece} selected
         */
        $scope.select = function(piece)
        {
            // Don't continue if re-selecting a piece or if a piece is already matched.
            if (piece.matched || piece.selected || game.solved) return;

            piece.selected = true;

            selections.push(piece);

            // When we've made two selections, check them.
            if (selections.length==2) {
                game.tries ++;
                var a = selections[0], b = selections[1];
                // See if they match.
                if (! a.matches(b)) {
                    // No Match. briefly show selections and then unselect.
                    $timeout(function(){
                        a.selected = false;
                        b.selected = false;
                    }, 1000);
                }

                // Clear.
                selections = [];
            }

            // If solved, add a class to the body which shows the final message.
            game.solved = game.board.solved();
        };

        /**
         * Reset the game.
         */
        this.reset = function()
        {
            this.tries = 0;
            this.solved = false;
            selections = [];
            game.board.reset($timeout);
        }
    }]);


/**
 * This object represents one game piece.
 * Two pieces have the same id.
 * @param id Number
 * @param type string a|b
 * @param image string url
 * @constructor
 */
app.GamePiece = function (id, type, image)
{
    this.id = id;
    this.type = type;
    this.uid = id+type;
    this.image = image;

    this.matched = false;
    this.selected = false;

    /**
     * Select this game piece.
     * @param boolean
     * @returns {GamePiece}
     */
    this.select = function(boolean)
    {
        this.selected = (typeof boolean=="undefined" ? true : boolean);
        return this;
    };

    /**
     * Check if this piece matches another piece.
     * If it does, marked both as matched.
     * @param piece GamePiece
     * @returns {boolean}
     */
    this.matches = function(piece)
    {
        if (this.id === piece.id) {
            app.GamePieceCollection.instance.matches ++;
            return this.matched = piece.matched = true;
        }
        return false;
    };

    /**
     * Reset the piece.
     */
    this.reset = function()
    {
        this.matched = false;
        this.selected = false;
    };
};

/**
 * This is a collection of game pieces.
 * Angular uses this array to display and track.
 * @constructor
 */
app.GamePieceCollection = function (items)
{
    app.GamePieceCollection.instance = this;

    this.items = items || [];

    // Total number of matching pairs.
    this.matches = 0;

    /**
     * Randomize the item array.
     * @returns {GamePieceCollection}
     */
    this.shuffle = function()
    {
        var array = this.items;
        for (var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x) {}
        this.items = array;
        return this;
    };

    /**
     * Check if the puzzle was solved.
     * @returns {boolean}
     */
    this.solved = function()
    {
        for (var i=0; i<this.items.length; i++) {
            if (! this.items[i].matched) {
                return false;
            }
        }
        return true;
    };

    /**
     * Reset and shuffle the game.
     */
    this.reset = function($timeout)
    {
        this.matches = 0;
        for (var i=0; i<this.items.length; i++) {
            this.items[i].reset();
        }
        // Wait for the animation to run
        $timeout(function(){
            app.GamePieceCollection.instance.shuffle();
        },500);

    }

};

/**
 * Create and populate a new game collection.
 */
app.GamePieceCollection.create = function ()
{
    var items = [];
    for (var i=0; i<app.images.length; i++) {
        items.push( new app.GamePiece(i, "a", app.images[i]) );
        items.push( new app.GamePiece(i, "b", app.images[i]) );
    }
    var game = new app.GamePieceCollection(items);

    // Shuffle it up and have fun!!
    return game.shuffle();
};
