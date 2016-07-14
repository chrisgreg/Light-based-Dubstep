// Import the interface to Tessel hardware
var tessel = require('tessel');
var ambientlib = require('ambient-attx4');

var ambient = ambientlib.use(tessel.port['A']);

// Turn one of the LEDs on to start.
tessel.led[2].on();


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('<html><head><script src="/socket.io/socket.io.js"></script><script>var socket = io(); socket.on(\'intensity\', function (intensity) { console.log(intensity) })</script></head><body><h1>Barry White ♪♬♩♫</h1><button onclick="socket.emit(\'calibrate\');">💡</button></body></html>');
});

var max = 0;
io.on('connection', function(socket){
  console.log('a user connected');
  setInterval(function () {
    socket.emit('intensity', Math.random());
  }, 500);
  socket.on('calibrate', function(msg){
    calibrate(function (newMax) {
      max = newMax;
      console.log("New Max: " + newMax);
    })
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});





ambient.on('ready', function () {
  http.listen(3000, function(){
    console.log('listening on *:3000');
  });
});

ambient.on('error', function (err) {
  console.log(err);
});



function calibrate(callback){
  var lightReadings = [];
  var readLight = setInterval(getLight, 500);

  function getLight(){
    if (lightReadings.length > 10) {
      var max = lightReadings.reduce( ( a, b ) => a + b, 0 )
                                     / lightReadings.length;
      clearInterval(readLight);
      return callback(max);
    } else {
      ambient.getLightLevel((err, lightData) => {
        if (err) throw err;
        lightReadings.push(lightData)
      })
    }
  }
}
