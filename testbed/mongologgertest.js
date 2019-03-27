//----------------------------------------------------------------------------
//    mongologgertest.js
//
//    Mar 24 2019    Initial
//    Mar 25 2019    Synchronous call of logger...
//    Mar 27 2019    Playing with async & Promise...
//----------------------------------------------------------------------------

const Version = "mongologgertest.js:1.17 Mar 27 2019 ";

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
  logger.debug('Wait for ' + ms / 1000 + ' sec');
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mongoosecycle() {
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://vboxweb:4100/cams',{useNewUrlParser: true, keepAlive: false } )
    .then(function(MongooseObject) {
      logger.info('Mongoose now ready [' + MongooseObject.connection.readyState + ']');
      
      const mylogger = new mongologger('MONGOLOGTSTASYNC');
      mylogger.log('Starts now using : ' + mongologger.getVersion(), mylogger.DEBUG);
      mylogger.log('Exit now', mylogger.DEBUG);
      
      logger.infos('Bye bye mongo');
      mongoose.disconnect().then(function () {
        logger.debug('Mongoose is disconnected');
      });
      resolve('Done');
    })
    .catch(function(reason) {
      logger.info(reason.message);
      reject('Got a problem');
    });
  });
}

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
async function main () {
  await mongoosecycle().then( value => {
    logger.debug(value);
  });
  await sleep(1000);  // Just give time to flush mongo cache before exiting
  process.exit(0);
}
//----------------------------------------------------------------------------
logger.infos('Start ASYNC work');
main();
logger.infos('Start SYNC work');
mongoose.connect('mongodb://vboxweb:4100/cams',{useNewUrlParser: true, keepAlive: false } )
.then(function(MongooseObject) {
  logger.info('Mongoose now ready [' + MongooseObject.connection.readyState + ']');
  
  const mylogger = new mongologger('MONGOLOGTSTSYNC');
  mylogger.log('Starts now using : ' + mongologger.getVersion(), mylogger.DEBUG);
  mylogger.log('Exit now', mylogger.DEBUG);
  
  logger.infos('Bye bye mongo again');
  mongoose.disconnect().then(function () {
    logger.debug('Mongoose is disconnected');
  });
})
.catch(function(reason) {
  logger.info(reason.message);
  reject('Got a problem');
});


