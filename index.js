// Import the interface to Tessel hardware
var tessel = require('tessel');
var ambientlib = require('ambient-attx4');

var ambient = ambientlib.use(tessel.port['A']);
ambient.pollingFrequency = 50;

// Turn one of the LEDs on to start.
tessel.led[2].on();

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'));

app.get('/', function(req, res){
  var script = "";
  script += "const context = new AudioContext(); ";

  script += "const filterNode = context.createBiquadFilter(); ";
  script += "filterNode.type = 'lowpass'; ";
  script += "filterNode.frequency.value = 5000; ";
  script += "filterNode.connect(context.destination); ";

  script += "const oscillator = context.createOscillator(); ";
  script += "oscillator.type = 'square'; ";
  script += "oscillator.frequency.value = 60; ";
  script += "oscillator.connect(filterNode); ";
  script += "oscillator.start(context.currentTime); ";

  script += "function setIntensity(intensity) { ";
  script += "	filterNode.frequency.value = intensity * 10000; ";
  script += "} ";

  script += "function setFrequency(intensity) { ";
  script += "	const frequency = intensity; ";
  script += "	oscillator.frequency.value = frequency; ";
  script += "} ";
    res.send('<html><head><script src="/socket.io/socket.io.js"></script><script>var socket = io(); socket.on(\'intensity\', function (intensity) { console.log(intensity); setIntensity(intensity); })</script></head><body><h1>Barry White ♪♬♩♫</h1><button onclick="socket.emit(\'calibrate\');">💡</button><script>'+script+'</script></body></html>');
});

var max = 0;
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('calibrate', function(msg){
    calibrate(function (newMax) {
      max = newMax;
      console.log("New Max: " + newMax);

      setInterval(function () {
        // socket.emit('intensity', Math.random());
        ambient.getLightLevel((err, lightData) => {
          if (err) throw err;
          var normalise = normaliseData(max, lightData);
          console.log(normalise);
          socket.emit('intensity', normalise);
        })
      }, 50);
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


function normaliseData(max, value) {
  //console.log(value + ', ' + Math.min(Math.max(value-0.4/max-0.4, 0), 1));
  var normalised = ((value/max-0.5)*2);
  normalised = Math.min(normalised, 1);
  normalised = Math.max(normalised, 0);
  return normalised;
}

function calibrate(callback){
  var lightReadings = [];
  var readLight = setInterval(getLight, 100);

  function getLight(){
    if (lightReadings.length > 3) {
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
