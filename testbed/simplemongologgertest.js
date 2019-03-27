//----------------------------------------------------------------------------
//    simplemongologgertest.js
//
//    Mar 27 2019    Initial, from mongologgertest
//----------------------------------------------------------------------------

const Version = "simplemongologgertest.js:1.03 Mar 27 2019 ";

const mongoose = require('mongoose');

const mongologger = require('../src/utilities/mongologger');
const helpers = require('../src/utilities/helpers');
const logger = require("../src/utilities/logger");

console.log('\n\n');
logger.infos(Version + 'Start SYNC WORK ');

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
const mylogger = new mongologger('MONGOLOGTSTSYNC-SIMPLE');
mylogger.log('Starts now using : ' + mylogger.getVersion(), mylogger.DEBUG);
// Test the 5 messages types
/*
mylogger.debug('This is the debug level');
mylogger.informational('This is the informational level');
mylogger.warning('This is the warning level');
mylogger.error('This is the error level');
mylogger.fatal('This is the fatal level');
*/
// Exit
mylogger.log('Enter a 1 sec wait for mongo to flush', mylogger.DEBUG);
(async() => {
  await helpers.sleep(5000);    // Wait for mongo to flush cache
  process.exit(0);
})();

