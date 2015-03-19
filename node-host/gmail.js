var SerialPort = require("serialport").SerialPort;
var Q = require('q');

var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var gmail = google.gmail('v1');

var CLIENT_ID = 'XXXX',
    CLIENT_SECRET = 'XXXX',
    REDIRECT_URL = 'http://localhost';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var tokens = {"access_token":"XXXX","token_type":"Bearer","refresh_token":"XXXX","expiry_date":1422480333629}
oauth2Client.setCredentials(tokens);

var getEmail = function() {
  var deferred = Q.defer();
  gmail.users.getProfile({userId: 'me', auth: oauth2Client}, function(err, profile) {
    deferred.resolve(profile.emailAddress + "\n");
  });
  return deferred.promise;
}

var getUnreadCount = function() {
  var deferred = Q.defer();
  gmail.users.messages.list({userId: 'me', auth: oauth2Client, q: 'in:inbox is:unread'}, function(err, mail) {
    if (mail.messages) {
      deferred.resolve('Unread messages: ' + mail.messages.length + '\n');
    } else {
      deferred.resolve('Unread messages: 0' + '\n');
    }
  });
  return deferred.promise;
}

var getUnreadMessages = function() {
  var deferred = Q.defer();
  gmail.users.messages.list({userId: 'me', auth: oauth2Client, q: 'in:inbox is:unread'}, function(err, mail) {
    if (err) {
      console.log(JSON.stringify(err));
    }

    if (mail.messages) {
      deferred.resolve(mail.messages);
    } else {
      deferred.resolve(null);
    }
  });
  return deferred.promise;
}

var formatMessagesForDisplay = function(messages) {
  var deferred = Q.defer();
  if (messages) {
    var output = "Unread messages: " + messages.length + "\n";
    messages.forEach(function(message) {
      gmail.users.messages.get({userId: 'me', auth: oauth2Client,
        id: message.id, format: 'metadata', metadataHeaders: ['Subject', 'From']}, function(err, mail) {
        output += mail.payload.headers['From'] + "\n";
        output += mail.payload.headers['Subject'] + "\n";
      });
    });
    deferred.resolve(output);
  } else {
    deferred.resolve('Unread messages: 0' + '\n');
  }
  return deferred.promise;
}

var getDateTime = function() {
  var deferred = Q.defer();
  var date = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after

  date += "\n\n";
  deferred.resolve(date);
  return deferred.promise;
}

var output = "";
var updateOutput = function(val) {
  output += val;
}

var serialPort = new SerialPort("/dev/tty.usbserial-DA0145XF", {
  baudrate: 9600
}, false);

var sendToArduino = function() {
  /*serialPort.open(function (error) {
      serialPort.write(output, function(err, results) {
        if (err) {
          console.log('err ' + err);
        }
      });
  });*/

  console.log(output);
}

function run() {
  getEmail()
    .then(updateOutput)
    .then(getUnreadMessages)
    .then(formatMessagesForDisplay)
    .then(updateOutput)
    .then(sendToArduino);
}

console.log('Starting Gmail watcher...');
setInterval(run, 5000);
