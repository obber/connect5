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
    $scope.getPlayerColor = State.getPlayerColor;
    
    $scope.getTurnColor = function() {
      var currentTurn = State.getTurn() ? 'black' : 'white';
      return State.getPlayerColor() === currentTurn ? 'your turn!' : 'opponent\'s turn!';
    }

    $scope.add = function(marble) {
      var turnColor = State.getTurn() ? "black" : "white";

      if (turnColor !== State.player.color) {
        console.error('its not your turn yet!');
        return;
      }

      if (!marble.taken) {
        marble.color = turnColor;
      }

      State.addMarble(marble.id, marble.color);
    }

    // broadcast listeners

    $scope.$on('ready', function() {
      console.log('game is ready');
      $scope.$apply();
    })

    $scope.$on('addMarble', function() {
      console.log($scope.getPlayerColor());
      $scope.$apply();
    });

    $scope.$on('gameover', function(_, marble) {
      $scope.winner = marble.color;
      $scope.gameover = true;
      $scope.$apply();
    });

  }; // Controller End

})();
