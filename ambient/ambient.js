// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This ambient module example console.logs
ambient light and sound levels and whenever a
specified light or sound level trigger is met.
*********************************************/

var tessel = require('tessel');
var ambientlib = require('ambient-attx4');

var ambient = ambientlib.use(tessel.port['A']);

ambient.on('ready', function () {

  // // Calibrate
  // calibrate(function(value) {
  //   console.log("Max is: " + value);
  // });

 // Reference Data:
 // // Get points of light and sound data.
 //  setInterval( function () {
 //    ambient.getLightLevel( function(err, lightdata) {
 //      if (err) throw err;
 //      ambient.getSoundLevel( function(err, sounddata) {
 //        if (err) throw err;
 //        console.log("Light level:", lightdata, " ", "Sound Level:", sounddata;
 //      });
 //    });
 //  }, 500); // The readings will happen every .5 seconds
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

// function normaliseData(max) {
//   normalized_x = (x - minimum)/(maximum - minimum)
//   var normalised =
// }



module.exports = {
  calibrate: calibrate
}
