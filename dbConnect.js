/**
 * Open mongo Connection
 */
const MongoClient = require('mongodb').MongoClient;

var dao = {};

MongoClient.connect('mongodb://client:12345@ds117919.mlab.com:17919/production-defects', function(err, database) {
  if (err) {return console.log(err);}
  else { console.log('successful db connection');}
  dao.db = database;
});

module.exports = dao;
