(function() {

  var app = angular.module('app', ['ui.router']);

  app.config(routes);
  app.run(onReady);

  function routes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('play', {
        url: "/play",
        templateUrl: "views/play.html"
      });
  }

  function onReady($state) {
    socket.on('ready', function(black) {
      setTimeout(function() {
        $state.go('play');
      }, 1000);
    });
  }

})();

(function() {

  var app = angular.module('app');

  // ----------------------------
  // ID Helper

  app.factory('IDHelper', IDHelper);

  function IDHelper() {

    // dicionary object for optimized letterToNum lookup. (key:value, letter:index)
    var dictionary = {
      'A' : 0,  'B' : 1,  'C' : 2,  'D' : 3,  'E' : 4,
      'F' : 5,  'G' : 6,  'H' : 7,  'I' : 8,  'J' : 9,
      'K' : 10, 'L' : 11, 'M' : 12, 'N' : 13, 'O' : 14,
      'P' : 15, 'Q' : 16, 'R' : 17, 'S' : 18
    };

    // dictionary array for optimized numToLetter lookup
    var dictionaryArr = [
      'A', 'B', 'C', 'D', 'E',
      'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S'
    ];

    return {
      letterToNum: letterToNum,
      numToLetter: numToLetter,
      generateIds: generateIds,
      connectionIds: connectionIds
    }

    // ---------------

    function letterToNum(letter) {
      return dictionary[letter];
    }

    function numToLetter(num) {
      return dictionaryArr[num];
    }

    function idToIndex(id) {
      return [
        letterToNum(id.charAt(0)),
        letterToNum(id.charAt(1))
      ];
    }

    function indexesToId(arr) {
      return arr.map(function(index) {
        return numToLetter(index);
      }).join('');
    }

    function generateIds() {
      var result = {};

      for (var letterOne in dictionary) {
        var id = letterOne;
        for (var letterTwo in dictionary) {
          id += letterTwo;
          result[id] = null;
          id = id.charAt(0);
        }
      }

      return result;
    }

    function connectionIds(id) {
      var rootIndex = idToIndex(id);
      var r = rootIndex[0];
      var c = rootIndex[1];
      var connectionIndexes = [
        [ r    , c - 1 ],
        [ r + 1, c - 1 ],
        [ r + 1, c     ],
        [ r + 1, c + 1 ],
        [ r    , c + 1 ],
        [ r - 1, c + 1 ],
        [ r - 1, c     ],
        [ r - 1, c - 1 ]
      ]

      return connectionIndexes.map(function(indexes) {
        return indexesToId(indexes);
      });
    } // end connectionIds

  } // end IDHelper

})();

(function() {

  var app = angular.module('app');

  // ----------------------------
  // Board State

  app.factory('State', State);

  function State(IDHelper, $rootScope, $state) {

    console.log('when does this run?');

    var storage = generateStorage(); // stores our nodes id:node (key:value) format
    var slots = generateSlots(); // array of objects: { id: id, taken: true/false, color: black/white }
    var turn = true;
    var winner = null;
    var player = { color: null };

    init();

    return {
      storage: storage,
      slots: slots,
      getTurn: getTurn,
      get: get,
      viewStorage: viewStorage,
      viewSlots: viewSlots,
      addMarble: addMarble,
      player: player,
      getPlayerColor: getPlayerColor
    }

    // ----------------------------

    function init() {
      
      socket.on('playReady', function(black) {
        player.color = black ? 'black' : 'white';
        $rootScope.$broadcast('ready');
      });

      // playerLoaded emission must be AFTER playReady listener.
      socket.emit('playerLoaded');

      // listen for newMarble event from socket
      socket.on('newMarble', function(marble) {
        if (!storage[marble.id].taken) {
          addMarble(marble.id, marble.color, true);
          $rootScope.$broadcast('addMarble');
        }
        if (winner) {
          $rootScope.$broadcast('gameover', marble);
        }
      });
    }

    function get(id) {
      return storage[id];
    }

    function viewStorage() {
      return storage;
    }

    function viewSlots() {
      return slots;
    }

    function getTurn() {
      return turn;
    }

    function Marble(id) {
      this.id = id;
      this.color = null;
      this.taken = false;
      this.connections = [null, null, null, null, null, null, null, null];
    }

    function getPlayerColor() {
      return player.color;
    }

    function addMarble(id, color, opponent) {
      if (id === undefined && color === undefined) {
        console.error('id & color needs to be defined to create a Marble!');
      } else if ( !(/[A-S][A-S]/.test(id)) ) {
        console.error('not a legit id!');
      } else if (storage[id].taken) {
        console.error('spot is already taken!');
      } else {

        var marble = storage[id];

        if (!opponent) {
          socket.emit('addMarble', marble);
        }

        turn = !turn;
        marble.taken = true;
        marble.color = color;
        marble.connections = findConnections(id);

        // iterate through marble's connections and add itself as a connectee
        marble.connections.forEach(function(targetID, i) {
          if (storage[targetID]) {
            var p = i < 4 ? i + 4 : i - 4;
            storage[targetID].connections[p] = marble.id;
          }
        });
      }

      if(checkWin(marble)) {
        winner = marble.color;
      }
    }

    function findConnections(id) {
      return IDHelper.connectionIds(id)
        .map(function(id) {
          return storage[id] ? id : null;
        });
    }

    function checkWin(marble) {
      var connections = marble.connections;
      var lengths = [];
      var result;

      connections.forEach(function(next, direction) {
        next = storage[next];
        var count = 0;

        while (next) {
          if (next.taken && next.color === marble.color) {
            next = storage[next.connections[direction]];
            count++;
          } else {
            break;
          }
        }

        lengths.push(count);
      });

      for (var i = 0; i < 4; i++) {
        if (1 + lengths[i] + lengths[i+4] >= 5) {
          return true;
        }
      }

      return false;
    }

    function generateStorage() {
      var result = IDHelper.generateIds();

      for (var id in result) {
        result[id] = new Marble(id);
      }

      return result;
    }

    function generateSlots() {
      var slots = [];

      for (var id in storage) {
        slots.push(storage[id]);
      }

      slots.sort(function(a,b) {
        num = IDHelper.letterToNum;
        if (a.id.charAt(1) === b.id.charAt(1)) {
          return num(a.id.charAt(0)) - num(b.id.charAt(0));
        } else {
          return num(a.id.charAt(1)) - num(b.id.charAt(1));
        }
      });

      return slots;
    }

  } // factory end

})();

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
      return State.getPlayerColor() === currentTurn ? 'your' : 'opponent\'s';
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
