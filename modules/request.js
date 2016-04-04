var bodyParser = require('body-parser');

// receive POST request at /api/add
  // process POST request
  // expect a body of {id: id} format

function receiveMarbleFromClient(req, res) {
  console.log(req.body);
  res.send('thanks!');
}


// receive GET request at /api/turn

// receive GET request at /api/board



module.exports = {
  add: receiveMarbleFromClient
}
