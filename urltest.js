//----------------------------------------------------------------------------
//    urltest.js
//
//    Dec 20 2018   Initial
//    Dec 21 2018   WIP on test URLs
//    Dec 22 2018   Cams tests
//    Mar 06 2019   console.log replaced by logger
//----------------------------------------------------------------------------

const Version = "urltest.js:1.34, Mar 06 2018 ";

const fetch = require("node-fetch");
const logger = require('./src/utilities/loggerlogger');

logger.tracetofile('/tmp/urltest.log');

logger.info();
logger.info(Version + '----------------- urltest -------------------------------');
const camuser = process.env.CAMUSER;
const campass = process.env.CAMPASS;

// ------------ The working function ------------------------------------------
function urlcall(theurl) {
  logger.info(Version + 'Calling ---------- ' + theurl);
  logger.info('==========================================================================');

  // Look @ : https://appdividend.com/2018/08/20/javascript-fetch-api-example-tutorial/
  //      @ : https://javascript.info/promise-chaining 
  
  let result = fetch(theurl)
  .then(response => { 
      return response.text();
  })
  .then(text => {
    logger.info(Version + text === undefined ? 'No data' : text);
    logger.info('\n\n');
  })
  .catch(error => {
    logger.error(Version + '************************************* E R R O R ********************************');
    logger.error(Version + error);
  });
};

// ------------ Call Test URL ------ ------------------------------------------
const cam1 = process.env.CAMURL || 'https://jsonplaceholder.typicode.com/users/2';
let target = '';
if (camuser !== undefined && campass !== undefined) {
  target = cam1 + '&usr=' + camuser + '&pwd=' + campass; 
}
else {
  logger.info(Version + 'Using default test URL');
  target = cam1; 
}
logger.info(Version + 'Calling CAM1 now :' + target);
urlcall(target);
