//----------------------------------------------------------------------------
//    mongologreader.js
//
//    Mar 27 2019    Initial, from mongologgertest
//    Mar 28 2019    Query problems
//----------------------------------------------------------------------------

const Version = "mongologreader.js:1.09 Mar 28 2019 ";

const mongo = require('../src/utilities/mongo');
const helpers = require('../src/utilities/helpers');
const logger = require("../src/utilities/logger");
const Mongolog = require ('../src/models/mongoLogModel');

const ObjectId = require('mongodb').ObjectId;

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
try {
  parseCommandLine();
}
catch(Error) {
    console.log('********** Error : ' + Error);
    usage();
}
// Now proceed to query
mongo.getMongoDBConnection();
let query = Mongolog.find({ });
query.select('module message timestamp severity');
if (loglimit) {
  query.limit(loglimit);
}
query.exec(function(err, thelist) {
  if (err) console.log(err);
  else {
    thelist.forEach((value, index) => {
      // index = index.toString();
      ;
      console.log('[ %s ] %s Time: %s Message: %s', ('000'+index).slice(-3), 
                  value.module, 
                  helpers.convertDateTime(value.timestamp), 
                  value.message );
    });
  }
});
// Exit
(async() => {
  await helpers.sleep(2000);    // Wait for mongo to flush cache
  process.exit(0);
})();
