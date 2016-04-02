(function() {

  var app = angular.module('app');

  // ----------------------------
  // Board Controller

  app.controller('Board', function($scope, State) {

    var turn = true;

    console.log('in controller');

    $scope.board = State.getSlots();

    $scope.add = function(item) {
      console.log(item.id);

      if (!item.taken) {
        color = turn ? "black" : "white"
        State.addMarble(item.id, color);
        
        item.taken = true;
        turn = !turn;
      }
    }

    $scope.view = function() {
      console.log(State.viewStorage());
    }

  });

})();
