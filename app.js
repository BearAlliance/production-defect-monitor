var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
const MongoClient = require('mongodb').MongoClient;

var app = express();
var db;


/**
 * Open mongo Connection
 */
MongoClient.connect('mongodb://client:12345@ds117919.mlab.com:17919/production-defects', function(err, database) {
  if (err) {return console.log(err);}
  else { console.log('successful db connection');}
  db = database;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);




app.post('/setDays', function(req, res) {
  console.log('POST manual set');
  console.log(req.body);
  db.collection('osha').insertOne(req.body, function(err, result) {
    if(err) {
      return console.log(err);
    }
    res.send(req.body);
  });
});

app.post('/reset', function(req, res) {
  console.log('POST reset');
  console.log(req.body);
  var rightNow = new Date();
  var lastReset = {lastReset: rightNow};
  db.collection('osha').updateONe({}, {$set: {lastReset:  rightNow}}, {}, function(err, result) {
    if(err) {
      return console.log(err);
    }
    res.send(req.body);
  });
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
