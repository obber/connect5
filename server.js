var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var black = true;
var users = 0;

// middleware to limit connections
app.use(limitConnections);

// public directory
app.use(express.static('public'));

// fallback
app.get('*', function(req, res) {
  res.send('Sorry, that page doesn\'t exist!');
});

io.on('connection', socketHandler);

// we use http here to accomodate for socket.io
// @url: http://bit.ly/1N5e3e6
http.listen(process.env.PORT || 5000);
console.log('app listening on port 3000');

// ----------------------------------

function limitConnections(req, res, next) {
  console.log('req url = ', req.url);
  if ( users > 2 && req.url === '/' ) {
    res.send('game is already in progress!');
  } else if (users > 2 && req.url === '/views/play.html') {
    res.send('game is already in progress!');
  } else {
    next();
  }
}

function socketHandler(socket) {
  // increment user
  users++;
  console.log('a user connected. # of users = ', users);

  // fire 'ready' event for client
  console.log('firing ready!');
  socket.emit('ready');

  // after player is loaded, fire playReady
  socket.on('playerLoaded', function() {
    console.log('heard playerLoaded..');
    black = !black;
    console.log('black = ', black);
    console.log('firing playReady');
    socket.emit('playReady', black);
  })

  // when a player adds a marble, emit 'newMarble' to opponent
  socket.on('addMarble', function(marble) {
    console.log('emitting newMarble');
    io.emit('newMarble', marble);
  });

  // on disconnect
  socket.on('disconnect', function() {
    users--;
    console.log('a user disconnected. # of users = ', users);
  });
}
