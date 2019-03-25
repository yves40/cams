//----------------------------------------------------------------------------
//    mongologgertest.js
//
//    Mar 24 2019    Initial
//    Mar 25 2019    Synchronous call of logger...
//----------------------------------------------------------------------------

const Version = "mongologgertest.js:1.13 Mar 25 2019 ";

const mongoose = require('mongoose');


const mongologger = require('../src/utilities/mongologger');
const mongo = require('../src/utilities/mongo');
const helpers = require('../src/utilities/helpers');
const logger = require("../src/utilities/logger");

console.log('\n\n');
logger.infos(Version + '----------------- mongologgertest -------------------------------');

//----------------------------------------------------------------------------
// Super sleep function ;-)
//----------------------------------------------------------------------------
function sleep(ms) {
  console.log('Wait for ' + ms / 1000 + ' sec');
  return new Promise(resolve => setTimeout(resolve, ms));
}

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
logger.infos('Start work');

let DB = null;

DB = mongoose.connect('mongodb://vboxweb:4100/cams',{useNewUrlParser: true, keepAlive: false } )
  .then(function(MongooseObject) {
    logger.info('Mongoose now ready [' + MongooseObject.connection.readyState + ']');
    return MongooseObject.connection;
  })
  .catch(function(reason) {
    logger.info(reason.message);
  });

//const DB = mongo.getMongoDBConnection();
//const mylogger = new mongologger('MONGOLOGTST', true);
//mylogger.log('Starts now using : ' + mylogger.getVersion());
//mylogger.log('Exit now');
//mylogger.log('I\'m not sure the log is written');
// mylogger.closeDB();
logger.infos('Bye bye');
// process.exit(0);


