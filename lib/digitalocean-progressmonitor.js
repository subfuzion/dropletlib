const
  DigitalOcean = require('digitalocean-api');

var ProgressMonitor = function(client) {
  this.client = client;
};


ProgressMonitor.prototype.monitor = function(eventid, callback) {
  var self = this;

  console.log('...');

  this.client.eventGet(eventid, function (err, status) {
    if (err) return callback(err);

    console.log(status.percentage || '0', '%');

    if (status.action_status == 'done') {
      console.log('\n', 'done');
      return callback();
    } else {
      setTimeout(function () {
	self.monitor(eventid, callback);
      }, 10 * 1000);
    }
  });
}

module.exports = ProgressMonitor;


