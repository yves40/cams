//----------------------------------------------------------------------------
//    mongologgertest.js
//
//    Mar 24 2019    Initial
//----------------------------------------------------------------------------

const Version = "mongologgertest.js:1.02 Mar 24 2019 ";

const mongologger = require('../src/utilities/mongologger');

const logger = require("../src/utilities/logger");

logger.infos(Version + '----------------- mongologgertest -------------------------------');

//----------------------------------------------------------------------------
// Super sleep function ;-)
//----------------------------------------------------------------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function worknow(timetowait) {
  const mylogger = new mongologger('MONGO');
  mylogger.log('Starts now using : ' + mylogger.getVersion());
  mylogger.log('Wait 10 seconds');
  await sleep(10);
  mylogger.log('Exit now');
  await sleep(2);
}

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
logger.infos('Start work');
worknow();
logger.infos('Bye bye');
process.exit(0);


