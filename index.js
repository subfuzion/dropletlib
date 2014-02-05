const
  DigitalOcean = require('digitalocean-api'),
  doconstants = require('./lib/digitalocean-constants'),
  util = require('util'),
  ProgressMonitor = require('./lib/digitalocean-progressmonitor'),
  TwilioClient = require('./lib/twilioclient.js');


var API = function(keys, to) {
  if (!keys.digitalocean_clientid || !keys.digitalocean_apikey) {
    throw new Error('missing digitalocean keys');
  }

  this.do_client = new DigitalOcean(keys.digitalocean_clientid, keys.digitalocean_apikey);
  this.progressMonitor = new ProgressMonitor(this.do_client);

  this.twilio_client = new TwilioClient(
    'ACf22d5d634e9e99b7572be0cab3059cbb',
    '786428c57b3413df4f2af408154976b3',
    '+16502625790');

  this.to = to;
};

module.exports = API;


API.prototype.monitor = function(id, callback) {
  this.progressMonitor.monitor(id, callback);
};

API.prototype.sendNotification = function(message, callback) {
  this.twilio_client.send(message, this.to, callback);
};

API.prototype.createDroplet = function(name, callback) {
  var self = this;

  this.do_client.dropletNew(
    name,
    doconstants.size_id,
    doconstants.image_id,
    doconstants.region_id,
    doconstants.ssh_key_id,
    function(err, droplet) {
      self.monitor(droplet.event_id, function(err) {
        if (err) {
	  self.sendNotification(err.message, self.to, function() {
	    return callback(err);
	  });
	}

        var message = util.format('created droplet %s (%s))', name, droplet.id);
	self.sendNotification(message, function() {
	  callback(null, droplet);
	});
      });
    }
  );
};

API.prototype.poweroffDroplet = function(id, callback) {
  var self = this;
  this.do_client.dropletPowerOff(id, function(err, eventid) {
    self.monitor(eventid, function(err) {
      if (err) {
	self.sendNotification(err.message, self.to, function() {
	  return callback(err);
	});
      }

      var message = util.format('powered off droplet (%s))', id);
      self.sendNotification(message, function() {
	callback(null, eventid);
      });
    });
  });
};

API.prototype.poweronDroplet = function(id, callback) {
  var self = this;
  this.do_client.dropletPowerOn(id, function(err, eventid) {
    self.monitor(eventid, function(err) {
      if (err) {
	self.sendNotification(err.message, self.to, function() {
	  return callback(err);
	});
      }

      var message = util.format('powered on droplet (%s))', id);
      self.sendNotification(message, function() {
	callback(null, eventid);
      });
    });
  });
};

API.prototype.destroyDroplet = function(id, callback) {
  var self = this;
  this.do_client.dropletDestroy(id, function(err, eventid) {
    self.monitor(eventid, function(err) {
      if (err) {
	self.sendNotification(err.message, self.to, function() {
	  return callback(err);
	});
      }

      var message = util.format('destroyed droplet (%s))', id);
      self.sendNotification(message, function() {
	callback(null, eventid);
      });
    });
  });
};

