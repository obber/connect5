var users = 0;
var black = true;
var rematchCount = 0;

function limit(req, res, next) {
  if ( users > 2 && req.url === '/' ) {
    res.send('game is already in progress!');
  } else if (users > 2 && req.url === '/views/play.html') {
    res.send('game is already in progress!');
  } else {
    next();
  }
}

function handler(socket) {

  var io = this;

  // increment user
  users++;
  console.log('a user connected. # of users = ', users);

  // fire 'ready' event for client
  if (users === 2) {
    console.log('firing ready!');
    io.emit('ready');
  }

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

  // when a player asks to play again
  socket.on('rematch', function() {
    io.emit('disconnectAll');
  });

  // on disconnect
  socket.on('disconnect', function() {
    users--;
    console.log('a user disconnected. # of users = ', users);
  });
}

module.exports.limit = limit;
module.exports.handler = handler;
