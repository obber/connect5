(function() {

  var app = angular.module('app');

  // ----------------------------
  // Board State

  app.factory('State', State);

  function State(IDHelper, $rootScope) {

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
      socket.on('ready', function(black) {
        player.color = black ? 'black' : 'white';
        $rootScope.$broadcast('ready');
      });

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
