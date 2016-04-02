(function() {

  var app = angular.module('app');

  // ----------------------------
  // Board State

  app.factory('State', function() {
    var storage = {};
    var slots = [];

    init();
    
    return {
      get: get,
      viewStorage: viewStorage,
      getSlots: getSlots,
      addMarble: addMarble
    }

    // ----------------------------

    function init() {
      // create null slots in storage to kick things off
      generateStorage();
    }

    function Marble(id, color) {
      this.id = id;
      this.color = color;
      this.connections = findConnections(id);
    }

    function get(id) {
      return storage[id];
    }

    function addMarble(id, color) {
      if (id === undefined && color === undefined) {
        console.error('id & color needs to be defined to create a Marble!');
      } else if ( !(/[0-8][0-8]/.test(id)) ) {
        console.error('not a legit id!');
      } else if (storage[id]) {
        console.error('spot is already taken!');
      } else {
        var marble = new Marble(id, color);
        storage[id] = marble;

        // iterate through marble connections and add itself as a connectee
        marble.connections.forEach(function(target, i) {
          if (target) {
            var p = i < 4 ? i + 4 : i - 4;
            target.connections[p] = marble;
          }
        });

        console.log(checkWin(marble));
      }
    }

    function findConnections(id) {
      var r = Number(id.charAt(0));
      var c = Number(id.charAt(1));
      var rP = r + 1;
      var rN = r - 1;
      var cP = c + 1;
      var cN = c - 1;
      var connectionIds = [
        '' + r  + cN,
        '' + rP + cN,
        '' + rP + c,
        '' + rP + cP,
        '' + r  + cP,
        '' + rN + cP,
        '' + rN + c,
        '' + rN + cN
      ]

      connections = connectionIds.map(function(id) {
        return storage[id] || null;
      });

      return connections;
    }

    function checkWin(marble) {
      var connections = marble.connections;
      var lengths = [];
      var result;

      connections.forEach(function(next, direction) {
        var count = 0;

        while (next) {
          if (next && next.color === marble.color) {
            next = next.connections[direction];
            count++;
          } else {
            return;
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

    function viewStorage() {
      return storage;
    }

    function getSlots() {
      return slots;
    }

    function generateStorage() {
      for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
          var row = i.toString();
          var column = j;
          storage[row + column] = null;
        }
      }

      for (var id in storage) {
        slots.push({
          id: id,
          taken: false
        });
      }

      slots.sort(function(a,b) {
        if (a.id.charAt(0) === b.id.charAt(0)) {
          return Number(a.id.charAt(1)) - Number(b.id.charAt(1));
        } else {
          return Number(a.id.charAt(0)) - Number(b.id.charAt(0));
        }
      });
    }

  }) // factory end

})(); // end
