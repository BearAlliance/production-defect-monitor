var dao = require('../dbConnect');
var moment = require('moment');

var DbService = {
  getLastReset: getLastReset,
  sendResults: sendResults,
  resetLastReset: resetLastReset,
  setDays: setDays
};

function getLastReset(req, res, next) {
  dao.db.collection('osha').findOne({lastReset: {$exists: true}}, function(err, results) {
    res.err = err;
    res.data = results;
    next();
  });
}

function setDays(req, res, next) {
  console.log('POST manually set days');
  if (req.body.days) {
    var days = req.body.days;

    var updatedDate = moment().subtract(days, 'days');
    console.log(updatedDate.format());
    dao.db.collection('osha').updateOne({lastReset: {$exists: true}}, {$set: {lastReset: updatedDate}}, function(err, result) {
      if (err) {
        res.status(500).send(err);
      }
      else {
        // res.data = result;
        res.status(200).send({updated: true, days: days});
      }
    });
  }
  else {
    res.status(404).send();
  }
}

function resetLastReset(req, res, next) {
  console.log('POST reset');
  var rightNow = moment();
  dao.db.collection('osha').updateOne({lastReset: {$exists: true}}, {$set: {lastReset: rightNow}}, function(err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.status(200).send(result);
    }
  });
}

function sendResults(req, res, next) {
  if (res.err) {
    res.status(500).send();
  }
  else if (res.data) {
    res.status(200).send(res.data);
  }
  else {
    res.status(404).send();
  }
}

module.exports = DbService;