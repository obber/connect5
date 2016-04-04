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
