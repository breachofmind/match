'use strict';

var app = {
    images: [
    // Images to use.
        'http://placehold.it/200x200?text=id1',
        'http://placehold.it/200x200?text=id2',
        'http://placehold.it/200x200?text=id3',
        'http://placehold.it/200x200?text=id4',
        'http://placehold.it/200x200?text=id5',
        'http://placehold.it/200x200?text=id6'
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

        /**
         * What happens when you select a game piece?
         * @param piece {app.GamePiece} selected
         */
        $scope.select = function(piece)
        {
            // Don't continue if re-selecting a piece or if a piece is already matched.
            if (piece.matched || piece.selected) return;

            piece.selected = true;

            selections.push(piece);

            // When we've made two selections, check them.
            if (selections.length==2) {
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

            if (game.board.solved()) {
                alert('you won!');
            }
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
            return this.matched = piece.matched = true;
        }
        return false;
    }
};

/**
 * This is a collection of game pieces.
 * Angular uses this array to display and track.
 * @constructor
 */
app.GamePieceCollection = function (items)
{
    this.items = items || [];

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
