(function() {

  var app = angular.module('app');

  // ----------------------------
  // Board Controller

  app.controller('Board', function($scope, State) {

    $scope.board = State.getSlots();
    $scope.gameover = false;
    $scope.winner;
    $scope.getTurn = State.getTurn

    $scope.add = function(item) {
      if (!item.taken) {
        item.color = State.getTurn() ? "black" : "white";
        item.taken = true;

        // check for winner
        if (State.addMarble(item.id, item.color)) {
          $scope.gameover = true;
          $scope.winner = item.color
        }
      }
    }

    // ---- debugging ------

    $scope.view = function() {
      console.log(State.viewStorage());
    }

  });

})();
