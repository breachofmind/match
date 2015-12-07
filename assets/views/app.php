<?php view('head'); ?>

<main id="Application">

    <section id="GameBoard" class="clearfix">

        <div class="piece-container aspect" ng-repeat="piece in game.board.items" ng-click="select(piece)" ng-class="{matched:piece.matched, selected:piece.selected && !piece.matched}">
            <div class="piece">
                <div class="front">
                    <img src="http://placehold.it/200x200?text=?" alt="Game piece">
                </div>
                <div class="back">
                    <img ng-src="{{piece.image}}" alt="Game piece">
                </div>
            </div>
            <div class="aspect-1-1"></div>
        </div>

        <p>Tries: <strong>{{game.tries}}</strong></p>
        <p>Accuracy: <strong>{{game.accuracy()}}</strong></p>
    </section>


    <section id="SuccessMessage">
        <p>You won!!!</p>
    </section>


</main>

<?php view('foot'); ?>
