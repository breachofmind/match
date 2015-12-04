<?php view('head'); ?>

<main id="Application" class="flex-row" ng-controller="GameCtrl as game">

    <div class="game-piece" ng-repeat="piece in game.board.items" ng-click="select(piece)" ng-class="{matched:piece.matched, selected:piece.selected}">
        <img ng-src="{{piece.image}}" alt="Game piece">
    </div>


</main>

<?php view('foot'); ?>