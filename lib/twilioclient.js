var TwilioClient = function(accountsid, authtoken, from) {
  this.from = from;
  this.client = require('twilio')(accountsid, authtoken);
};

TwilioClient.prototype.send = function(message, to, callback) {
  this.client.messages.create({
    to: to,
    from: this.from,
    body: message
  }, callback);
};

module.exports = TwilioClient;

