// dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// socket handler
var socketHandler = require('./modules/socketHandler.js');

// middleware to limit connections
app.use(socketHandler.limit);

// public directory
app.use(express.static(__dirname + '/public'));

// fallback
app.get('*', function(req, res) {
  res.send('Sorry, that page doesn\'t exist!');
});

// listen to sockets
io.on('connection', socketHandler.handler.bind(io));

// we use http here to accomodate for socket.io
// @url: http://bit.ly/1N5e3e6
http.listen(process.env.PORT || 5000);
console.log('app listening on port 5000');
