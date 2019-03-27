//----------------------------------------------------------------------------
//    simplemongologgertest.js
//
//    Mar 27 2019    Initial, from mongologgertest
//----------------------------------------------------------------------------

const Version = "simplemongologgertest.js:1.00 Mar 27 2019 ";

const mongoose = require('mongoose');

const mongologger = require('../src/utilities/mongologger');
const mongo = require('../src/utilities/mongo');
const helpers = require('../src/utilities/helpers');
const logger = require("../src/utilities/logger");

console.log('\n\n');
logger.infos(Version + '----------------- simplemongologgertest -------------------------------');

//----------------------------------------------------------------------------
// Super sleep function ;-)
//----------------------------------------------------------------------------
function sleep(ms) {
  logger.debug('Wait for ' + ms / 1000 + ' sec');
  return new Promise(resolve => setTimeout(resolve, ms));
}

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
logger.infos('Start SYNC work');
const mylogger = new mongologger('MONGOLOGTSTSYNC-SIMPLE');
mylogger.log('Starts now using : ' + mylogger.getVersion(), mylogger.DEBUG);
mylogger.log('Exit now', mylogger.DEBUG);
(async() => {
  await sleep(1000);    // Wait for mongo to flush cache
  process.exit(0);
})();

