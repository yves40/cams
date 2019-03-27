//----------------------------------------------------------------------------
//    mongologreader.js
//
//    Mar 27 2019    Initial, from mongologgertest
//----------------------------------------------------------------------------

const Version = "mongologreader.js:1.03 Mar 27 2019 ";

const mongoose = require('mongoose');

const mongologger = require('../src/utilities/mongologger');
const helpers = require('../src/utilities/helpers');
const logger = require("../src/utilities/logger");


let loglimit = null;
let timelimit = null;
let modulename = null;
//----------------------------------------------------------------------------
// Parse command line args
//----------------------------------------------------------------------------
function parseCommandLine() {
  process.argv.forEach((val, index) => {
    if (index >= 2) {     // Skip first two args which are node and program name
      let validparam = false;
      let param=val;
      let keyword=param.split('=')[0];
      if(keyword !== undefined) {
        let value = param.split('=')[1];
        if (value !== undefined)
          switch(keyword) {
            case '-t':  if (value.length < 6) {
                          // Expect user specified just hh:mm, so add current day month year
                          value = helpers.getDate() + ' ' + value;                       
                        }
                        timelimit = new Date(value);
                        logger.info(Version + 'Time limit set to : ' + helpers.convertDateTime(timelimit));
                        validparam = true;
                        break;
            case '-l':  loglimit = parseInt(value);
                        logger.info(Version + 'Will report no more than ' + loglimit + ' lines');
                        validparam = true;
                        break;
            case '-m':  modulename = value;
                        logger.info(Version + 'Searching for module : ' + modulename)
                        validparam = true;
            break;
          }
          if (!validparam) {
            throw new Error('Invalid parameter : ' + keyword);
          }
        }
      }
  });
  
}
//----------------------------------------------------------------------------
// ussage
//----------------------------------------------------------------------------
function usage() {
  console.log('\n');
  console.log('Usage : node mongologreader [-l=maxlog] [-m=modulename] -t=<valid-date>');
  console.log('[] maxlog is the xaximum number of log events reported.');
  console.log('[] modulename is the name of a module which logged in mongo repository.');
  console.log('[] valid-date defines the latest date to consider. All events posted before this date will not be read.');
  console.log('[]            Format must be either \"mon-dd-yyyy hh:mm\". or hh:mm');
  console.log('[]            Notice the surrounding \"\" when a full date is specified');
  console.log('\n');
}
//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
const mylogger = new mongologger('MONGOLOGREADER');
mylogger.log('Starts ', mylogger.DEBUG);
try {
  parseCommandLine();
}
catch(Error) {
    console.log('********** Error : ' + Error);
    usage();
  }

// Exit
mylogger.log('Enter a 3 sec wait for mongo to flush', mylogger.DEBUG);
(async() => {
  await helpers.sleep(3000);    // Wait for mongo to flush cache
  process.exit(0);
})();

