var http = require('http');
var io = require('socket.io');
var url = require('url');

var app = http.createServer(function(req, res) {
    var urlParts = url.parse(req.url);

    if(urlParts.path.indexOf("/drain") === 0) {
      var data = "";

      req.on('data', function(chunk) {
        data += chunk;
      });

      req.on('end', function() {
        res.end();

        var messages = data.split("\n");
        messages.pop();

        var room = urlParts.path.replace("/drains/", "");

        console.log("got "+messages.length+" messages.  Sending to "+socketApp.sockets.in(room).length+" listeners in "+room);

        for(var i=0,max=messages.length; i<max; i++) {
          socketApp.sockets.in(room).emit('log', messages[i]);
        }
      });
    } else {
      res.end("git out");
    }
});

app.listen(3333);

socketApp = io.listen(app);

socketApp.on('connection', function(socket) {
  socket.on('subscribe', function(room) {
    console.log("subscribe to "+room);
    socket.join(room);
  });
});
