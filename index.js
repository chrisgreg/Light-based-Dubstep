// Import the interface to Tessel hardware
var tessel = require('tessel');

// Turn one of the LEDs on to start.
tessel.led[2].on();

// Blink!
setInterval(function () {
  tessel.led[2].toggle();
  tessel.led[3].toggle();
}, 100);

console.log("I'm blinking! (Press CTRL + C to stop)");


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('<html><head><script src="/socket.io/socket.io.js"></script><script>var socket = io(); socket.on(\'intensity\', function (intensity) { console.log(intensity) })</script></head><body><h1>Barry White ♪♬♩♫</h1><button onclick="socket.emit(\'calibrate\');">💡</button></body></html>');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('calibrate', function(msg){
    // Set max light
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

setInterval(function () {
    io.emit('intensity', Math.random());
}, 500);