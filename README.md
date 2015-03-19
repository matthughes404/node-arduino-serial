# node-arduino-serial
Proof of concept for sending data from node.js via serial-over-USB to an Arduino

See http://matthughes.io/serial-communication-with-node-js-and-arduino/ for more details.

##Configuration

* Set 'serialPort' in 'config.js' to the string path of the USB device.
* Set 'baudRate' in 'config.js' to the same rate as your Arduino's 'Serial.begin'
