var http = require('http');
var io = require('socket.io');

var app = http.createServer(function(req, res) {
    var data = "";

    req.on('data', function(chunk) {
      data += chunk;
    });

    req.on('end', function() {
      res.end();

      var messages = data.split("\n");
      messages.pop();

      for(var i=0,max=messages.length; i<max; i++) {
        socketApp.sockets.emit('log', messages[i]);
      }
    });
});

app.listen(3333);

socketApp = io.listen(app);
