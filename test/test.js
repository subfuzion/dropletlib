const
  assert = require('assert'),
  nconf = require('nconf'),
  shortid = require('shortid'),
  DropletLib = require('..');

var
  digitalocean_clientid,
  digitalocean_apikey,
  api;


nconf.env();

before(function() {
  var keys = {
    digitalocean_clientid: nconf.get('DIGITALOCEAN_CLIENTID'),
    digitalocean_apikey: nconf.get('DIGITALOCEAN_APIKEY'),
    twilio_accountsid: nconf.get('TWILIO_ACCOUNTSID'),
    twilio_authtoken: nconf.get('TWILIO_AUTHTOKEN'),
    twilio_phone: nconf.get('TWILIO_PHONE')
  };

  api = new DropletLib(keys, '14083328010');
});

describe('twilio test', function() {
  this.timeout(1000 * 10); // 10 seconds 

  it('should send an sms message to me', function(done) {
    api.sendNotification('test message', function(err, response) {
      if (err) return done(err);
      console.dir(response);
      done();
    });
  });
});


describe('smoke tests', function() {
  var dropletName;
  var dropletid;

  this.timeout(10 * (1000 * 60)); // 10 minutes

  it('should create a new droplet', function(done) {
    dropletName = createDropletName();
    api.createDroplet(dropletName, function(err, droplet) {
      if (err) return done(err);

      console.dir(droplet);

      assert(droplet.id);
      assert(droplet.event_id);
      dropletid = droplet.id;

      api.monitor(droplet.event_id, function(err) {
	if (err) return done(err);
	done();
      });
    });
  });

  it ('should power down the droplet', function(done) {
    api.poweroffDroplet(dropletid, function(err, eventid) {
      if (err) return done(err);
      api.monitor(eventid, function(err) {
	if (err) return done(err);
	done();
      });
    });
  });

  it ('should power up the droplet', function(done) {
    api.poweronDroplet(dropletid, function(err, eventid) {
      if (err) return done(err);
      api.monitor(eventid, function(err) {
	if (err) return done(err);
	done();
      });
    });
  });

  it ('should destroy the droplet', function(done) {
    api.destroyDroplet(dropletid, function(err, eventid) {
      if (err) return done(err);
      api.monitor(eventid, function(err) {
	if (err) return done(err);
	done();
      });
    });
  });

});




function createDropletName() {
  var id = shortid.generate();
  id = id.replace(/_/g, '-');
  var name = 'test-' + id + 'Z';
  console.log('droplet name: ' + name);
  return name;
}

 
