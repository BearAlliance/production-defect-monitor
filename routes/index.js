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
  DbService.setDaysForTeam,
  DbService.setDays
);

router.post('/reset',
  DbService.resetDaysForTeam,
  DbService.resetDaysGlobal
);

router.get('/lastReset',
  DbService.getLastReset,
  DbService.sendResults
);

/////////////////////

function renderDashboard(req, res, next) {
  var now = moment();
  var data = res.data;
  var timeDifferences = {
    global: now.diff(data.lastReset, 'days'),
    pay: now.diff(data.pay.lastReset, 'days'),
    time: now.diff(data.time.lastReset, 'days'),
    onboarding: now.diff(data.onboarding.lastReset, 'days')
  };

  res.render('index', {title: 'OSHA', diffs: timeDifferences});
}

module.exports = router;
