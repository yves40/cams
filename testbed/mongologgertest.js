//----------------------------------------------------------------------------
//    mongologgertest.js
//
//    Mar 24 2019    Initial
//    Mar 25 2019    Synchronous call of logger...
//----------------------------------------------------------------------------

const Version = "mongologgertest.js:1.10 Mar 25 2019 ";

const mongologger = require('../src/utilities/mongologger');
const mongo = require('../src/utilities/mongo');
const helpers = require('../src/utilities/helpers');
const logger = require("../src/utilities/logger");
const DELAY = 500; // msec

console.log('\n\n');
logger.infos(Version + '----------------- mongologgertest -------------------------------');

//----------------------------------------------------------------------------
// Super sleep function ;-)
//----------------------------------------------------------------------------
function sleep(ms) {
  console.log('Wait for ' + ms / 1000 + ' sec');
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(Version + ' ' + mongo.getMongoDBStatusText() + ' [' + mongo.getMongoDBStatus() + ']');
  while (mongo.getMongoDBStatus() !== mongo.CONNECTED) {
    console.log(Version + ' ' + mongo.getMongoDBStatusText() + ' [' + mongo.getMongoDBStatus() + ']');
    await sleep(DELAY);    // 1/2 sec tempo
  }
  mylogger.log('Starts now using : ' + mylogger.getVersion());
  mylogger.log('Exit now');
  mylogger.log('I\'m not sure the log is written');
  // mylogger.closeDB();
  logger.infos('Bye bye');
  // process.exit(0);
}

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
logger.infos('Start work');
const mylogger = new mongologger('MONGOLOGTST', true);
main();


