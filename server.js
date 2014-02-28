var http = require('http');
var io = require('socket.io');
var url = require('url');

var storedMessages = {}

var app = http.createServer(function(req, res) {
    var urlParts = url.parse(req.url);

    if(urlParts.path.indexOf("/drain") === 0) {
      var data = "";

      req.on('data', function(chunk) {
        data += chunk;
      });

      req.on('end', function() {
        res.end();

        var messages = data.indexOf("\n") > -1 ? data.split("\n") : [data, ""];
        messages.pop();

        var room = urlParts.path.replace("/drains/", "");

        if(messages.length) {
          console.log("got "+messages.length+" messages.  Sending to "+Object.keys(socketApp.sockets.in(room).sockets).length+" listeners in "+room);

          if(typeof(storedMessages[room]) === "undefined") {
            storedMessages[room] = [];
          }

          for(var i=0,max=messages.length; i<max; i++) {
            socketApp.sockets.in(room).emit('log', messages[i]);

            storedMessages[room].push(messages[i]);

            if(storedMessages[room].length > 100) {
              storedMessages[room].shift();
            }
          }

        }


      });

      res.end();
    } else {
      res.end("git out");
    }
});

app.listen(process.env.PORT || 3333);
console.log("listening on "+(process.env.PORT || 3333));

socketApp = io.listen(app);

socketApp.on('connection', function(socket) {
  socket.on('subscribe', function(room) {
    console.log("subscribe to "+room);
    socket.join(room);
  });

  socket.on('catchup', function(room) {
    if(typeof(storedMessages[room]) !== "undefined") {
      socket.emit('catchup', storedMessages[room]);
    }
  });
});
