function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


function go() {

  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  var room = "";

  while(room.length < 5) {
    room += characters[Math.floor(Math.random() * characters.length)];
  }

  var drainAdd = document.getElementById("drain-add");

  var drainRemove = document.getElementById("drain-remove");
  drainAdd.innerHTML = drainAdd.innerHTML.replace("REPLACETHIS", room);
  drainRemove.innerHTML = drainRemove.innerHTML.replace("REPLACETHIS", room);

  var socket = io.connect("http://sysinct.herokuapp.com:80");
  socket.emit("subscribe", room);

  var logContainer = document.getElementById("logs");
  var currentLogs = [];
  socket.on("log", function(log) {
    if(currentLogs.length > 10) {
      currentLogs.shift();
    }

    currentLogs.push(log);

    logContainer.innerHTML = htmlEntities(currentLogs.join("\n"));
  });

}
