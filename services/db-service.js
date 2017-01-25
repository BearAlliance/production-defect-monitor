var dao = require('../dbConnect');
var moment = require('moment');

var DbService = {
  getLastReset: getLastReset,
  sendResults: sendResults,
  resetDaysGlobal: resetDaysGlobal,
  setDays: setDays,
  setDaysForTeam: setDaysForTeam,
  resetDaysForTeam: resetDaysForTeam
};

function getLastReset(req, res, next) {
  dao.db.collection('osha').findOne({lastReset: {$exists: true}}, function(err, results) {
    res.err = err;
    res.data = results;
    next();
  });
}

function setDaysForTeam(req, res, next) {
  console.log('POST manually set days for team');
  if (req.body.team && req.body.days) {
    var days = req.body.days;
    var team = req.body.team;
    var updatedDate = moment().subtract(days, 'days');
    var location = team + ".lastReset";
    var query = {};
    query[location] = {$exists: true};
    var operation = {$set: {}};
    operation.$set[location] = updatedDate;

    dao.db.collection('osha').updateOne(query, operation, function(err, result) {
      if (err) {
        res.status(500).send(err);
      }
      else {
        next();
      }
    });
  }
  else {
    res.status(400).send();
  }
}

// Sets global days to the least of the three teams
function setDays(req, res, next) {
  console.log('POST manually set days');
  if (req.body.days) {
    var days = req.body.days;
    var updatedDate = moment().subtract(days, 'days');
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

function resetDaysForTeam(req, res, next) {
  if(req.body.team) {
    var team = req.body.team;
    var location = team + ".lastReset";
    var query = {};
    query[location] = {$exists: true};
    var operation = {$set: {}};
    operation.$set[location] = moment();

    dao.db.collection('osha').updateOne(query, operation, function(err, result) {
      if (err) {
        res.status(500).send(err);
      }
      else {
        next();
      }
    });
  }
  else {
    res.status(400).send();
  }
}

function resetDaysGlobal(req, res, next) {
  console.log('POST reset');
  var rightNow = moment();
  dao.db.collection('osha').updateOne({lastReset: {$exists: true}}, {$set: {lastReset: rightNow}}, function(err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.status(200).send({updated: true, days: 0});
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