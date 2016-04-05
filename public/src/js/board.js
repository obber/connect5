(function() {

  var app = angular.module('app');

  // ----------------------------
  // Board Controller

  app.controller('Board', BoardController);

  function BoardController($scope, State, $state) {

    init();

    function init() {
      $scope.board = State.getSlots();
      $scope.gameover = false;
      $scope.winner;
      $scope.getTurn = State.getTurn;
      $scope.getPlayerColor = State.getPlayerColor;
      $scope.viewStorage = State.viewStorage;
    }
    
    $scope.getTurnColor = function() {
      var currentTurn = State.getTurn() ? 'black' : 'white';
      return State.getPlayerColor() === currentTurn ? 'Your' : 'Opponent\'s';
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

    $scope.playAgain = function() {
      socket.emit('rematch');
      setTimeout(function() {
        window.location = host;
      }, 250);
    }

    // broadcast listeners
    // -------------------

    $scope.$on('ready', function() {
      $scope.$apply();
    })

    $scope.$on('addMarble', function() {
      $scope.$apply();
    });

    $scope.$on('gameover', function(_, marble) {
      $scope.winner = marble.color;
      $scope.gameover = true;
      $scope.$apply();
    });

  }; // Controller End

})();
