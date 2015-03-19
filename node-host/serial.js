var serialPort = require("serialport"),
    SerialPort = require("serialport").SerialPort,
    config = require("./config.js");

var sp = new SerialPort(config.serialPort, {
      baudrate: config.baudRate
}, false);

console.log("Starting up serial host...");

var message = "DATA GOES HERE";

function write() {
    sp.open(function(err) {
        console.log("Writing serial data: " + message);
        sp.write(message, function(err, res) {
                if (err) { console.log(err); }
                sp.close();
        });
    });
}

setTimeout(write, 1000); //wait 1s for everything to initialize correctly
setInterval(write, 5000); //write data every 5s

module.exports = {
  write: write
};
