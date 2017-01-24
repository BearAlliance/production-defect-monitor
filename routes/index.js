var express = require('express');
var router = express.Router();
var DbService = require('../services/db-service');
var moment = require('moment');

/* GET home page. */
router.get('/',
  DbService.getLastReset,
  renderDashboard
);


router.post('/setDays',
  DbService.setDays
);

router.post('/reset',
  DbService.resetLastReset,
  DbService.sendResults
);

router.get('/lastReset',
  DbService.getLastReset,
  DbService.sendResults
);

/////////////////////

function renderDashboard(req, res, next) {
  var now = moment();
  var lastReset = res.data.lastReset;
  var difference = now.diff(lastReset, 'days');
  console.log('difference', difference);
  res.render('index', {title: 'OSHA', lastReset: difference});
}

module.exports = router;
