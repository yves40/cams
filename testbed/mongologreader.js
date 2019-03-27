//----------------------------------------------------------------------------
//    mongologreader.js
//
//    Mar 27 2019    Initial, from mongologgertest
//----------------------------------------------------------------------------

const Version = "mongologreader.js:1.00 Mar 27 2019 ";

const mongoose = require('mongoose');

const mongologger = require('../src/utilities/mongologger');
const helpers = require('../src/utilities/helpers');
const logger = require("../src/utilities/logger");

console.log('\n\n');
logger.infos(Version + 'Start SYNC WORK ');

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
const mylogger = new mongologger('MONGOLOGREADER');
mylogger.log('Starts now using : ' + mylogger.getVersion(), mylogger.DEBUG);
// Exit
mylogger.log('Enter a 3 sec wait for mongo to flush', mylogger.DEBUG);
(async() => {
  await helpers.sleep(3000);    // Wait for mongo to flush cache
  process.exit(0);
})();

