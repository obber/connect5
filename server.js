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
http.listen(3000, "127.0.0.1");
console.log('app listening on port 3000');

// ----------------------------------

function limitConnections(req, res, next) {
  if (users >= 2 && req.url === '/') {
    res.redirect('inprogress.html');
  } else {
    next();
  }
}

function socketHandler(socket) {
  // increment user
  users++;
  console.log('a user connected. # of users = ', users);

  // fire 'ready' event for client
  socket.emit('ready', black);
  black = !black;

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
