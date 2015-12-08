<?php view('head'); ?>

<main id="Application">

    <section id="GameBoard" class="clearfix">

        <div class="piece-container aspect" ng-repeat="piece in game.board.items" ng-click="select(piece)" ng-class="{matched:piece.matched, selected:piece.selected && !piece.matched}">
            <div class="piece">
                <div class="front">
                    <div class="image-container">
                        <img src="/public/images/icon_gift.svg" alt="Game piece">
                    </div>
                </div>
                <div class="back">
                    <div class="image-container color-{{piece.id}}">
                        <img ng-src="{{piece.image}}" alt="Game piece">
                    </div>
                </div>
            </div>
            <div class="aspect-1-1"></div>
        </div>

    </section>

    <div id="Score" class="container">
        <p>Tries: <strong>{{game.tries}}</strong></p>
        <p>Accuracy: <strong>{{game.accuracy()}}</strong></p>
        <button ng-click="game.reset()" class="success">Reset</button>
    </div>


    <section id="SuccessMessage">
        <p>You won!!!</p>
    </section>


</main>

<?php view('foot'); ?>
