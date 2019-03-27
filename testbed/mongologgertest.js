//----------------------------------------------------------------------------
//    mongologgertest.js
//
//    Mar 24 2019    Initial
//    Mar 25 2019    Synchronous call of logger...
//----------------------------------------------------------------------------

const Version = "mongologgertest.js:1.14 Mar 25 2019 ";

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

function mongoosecycle() {
  mongoose.connect('mongodb://vboxweb:4100/cams',{useNewUrlParser: true, keepAlive: false } )
  .then(function(MongooseObject) {
    logger.info('Mongoose now ready [' + MongooseObject.connection.readyState + ']');
    
    //const mylogger = new mongologger('MONGOLOGTST', false);
    //mylogger.log('Starts now using : ' + mylogger.getVersion());
    //mylogger.log('Exit now');
    //mylogger.log('I\'m not sure the log is written');
    
    logger.infos('Bye bye mongo');
    mongoose.disconnect().then(function () {
      logger.debug('That is finished !!!!!!!!!!!!!!!!!');
    });
  })
  .catch(function(reason) {
    logger.info(reason.message);
  });
}

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
logger.infos('Start work');
mongoosecycle();
//const mylogger = new mongologger('MONGOLOGTST', false);
//process.exit(0);


