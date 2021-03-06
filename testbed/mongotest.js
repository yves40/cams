//----------------------------------------------------------------------------
//    mongotest.js
//
//    Feb 10 2019    Initial
//    Feb 11 2019    Tests
//    Feb 21 2019    mongodb synchronous call...
//    Feb 28 2019    WIP on mongodb connection checking
//    Mar 01 2019    WIP on mongodb connection checking II
//    Mar 02 2019    mongodb connection checking III
//                   Async functions
//    Mar 03 2019    mongodb connection checking IV
//    Mar 05 2019    mongodb connection checking V
//                   Start using my tiny logger
//    Mar 06 2019    Test trace to a file
//----------------------------------------------------------------------------

const Version = "mongotest.js:1.45 Mar 06 2019 ";

const mongo = require("../src/utilities/mongo");  
const logger = require("../src/utilities/logger");

const INTERVAL = 2000;
const LOOPS = 10;
let _DB = null;

console.log('\n\n' + Version + '----------------- mongotest -------------------------------\n\n');

//----------------------------------------------------------------------------
// Super sleep function ;-)
//----------------------------------------------------------------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//----------------------------------------------------------------------------
// Connect to mongo 
//----------------------------------------------------------------------------
logger.debug(Version + 'Using ' + mongo.getVersion());
_DB = mongo.getMongoDBConnection();
let iter = 1;
//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
checkMongo();

//----------------------------------------------------------------------------
// Check status
//----------------------------------------------------------------------------
async function checkMongo() {

  logger.tracetofile();
  logger.info(Version + 'Disabling the console log');
  logger.disableconsole();

  while (iter < LOOPS+1) {
    logger.infos(Version + 'Waiting for ' + INTERVAL/1000 + ' seconds');
    await sleep(INTERVAL);
    logger.debugs(Version + mongo.getMongoDBStatusText() + ' [' + iter + ']');
    ++iter;
  }
  logger.enableconsole();
  logger.infos(Version + 'Exit now after ' + --iter + ' iterations');
  process.exit(0);
}