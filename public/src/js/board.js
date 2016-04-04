(function() {

  var app = angular.module('app');

  // ----------------------------
  // Board Controller

  app.controller('Board', BoardController);

  function BoardController($scope, State) {

    $scope.board = State.slots;
    $scope.watcher = State.watcher;
    $scope.gameover = false;
    $scope.winner;
    $scope.getTurn = State.getTurn

    $scope.$on('addMarble', function() {
      $scope.$apply();
    });

    // debugging
    $scope.viewSlots = function() { console.log(State.viewSlots()) };

    $scope.add = function(marble) {
      console.log(marble);
      if (!marble.taken) {
          marble.color = State.getTurn() ? "black" : "white";
      }
      console.log(marble);

      if (State.addMarble(marble.id, marble.color)) {
        $scope.gameover = true;
        $scope.winner = marble.color;
      }
    }

  }; // Controller End

})();
