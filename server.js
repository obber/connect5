var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var game = require('./modules/gameState.js');
var request = require('./modules/request.js');

// public directory
app.use(express.static('public'));


io.on('connection', function(socket){
  console.log('a user connected');
});

// fallback
app.get('*', function (req, res) {
  res.send('Sorry, that page doesn\'t exist!');
});

function listClientsByID(roomId, namespace) {
    var result = [];
    var ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
      for (var id in ns.connected) {
        result.push(id);
      }
    }

    console.log('result = ', result);
    return result;
}

io.on('connection', function (socket) {


  socket.on('addMarble', function(marble) {
    console.log('emitting newMarble');
    io.emit('newMarble', marble);
  })
});



// we use http here to accomodate for socket.io
// @url: http://bit.ly/1N5e3e6
http.listen(3000, "127.0.0.1");
console.log('app listening on port 3000');
