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
    $scope.getTurn = State.getTurn;

    $scope.$on('addMarble', function() {
      $scope.$apply();
    });

    $scope.$on('gameover', function(_, marble) {
      $scope.winner = marble.color;
      $scope.gameover = true;
      $scope.$apply();
    });

    $scope.add = function(marble) {
      var turnColor = State.getTurn() ? "black" : "white";

      console.log('turnColor = ', turnColor);
      console.log('State.player.color = ', State.player.color);

      if (turnColor !== State.player.color) {
        console.error('its not your turn yet!');
        return;
      }

      if (!marble.taken) {
        marble.color = turnColor;
      }

      State.addMarble(marble.id, marble.color);
    }

  }; // Controller End

})();
