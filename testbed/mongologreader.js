//----------------------------------------------------------------------------
//    mongologreader.js
//
//    Mar 27 2019    Initial, from mongologgertest
//    Mar 28 2019    Query problems
//----------------------------------------------------------------------------

const Version = "mongologreader.js:1.12 Mar 28 2019 ";

const mongo = require('../src/utilities/mongo');
const helpers = require('../src/utilities/helpers');
const logger = require("../src/utilities/logger");
const Mongolog = require ('../src/models/mongoLogModel');

const ObjectId = require('mongodb').ObjectId;

let loglimit = null;
let uppertimelimit = null;
let lowertimelimit = null;
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
            case '-ut': if (value.length < 6) {
                          // Expect user specified just hh:mm, so add current day month year
                          value = helpers.getDate() + ' ' + value;                       
                        }
                        uppertimelimit = new Date(value);
                        logger.info(Version + 'Upper time limit set to : ' + helpers.convertDateTime(uppertimelimit));
                        validparam = true;
                        break;
          case '-lt': if (value.length < 6) {
                        // Expect user specified just hh:mm, so add current day month year
                        value = helpers.getDate() + ' ' + value;                       
                      }
                      lowertimelimit = new Date(value);
                      logger.info(Version + 'Lower time limit set to : ' + helpers.convertDateTime(lowertimelimit));
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
  if((lowertimelimit && uppertimelimit)&&(lowertimelimit > uppertimelimit)) {
      throw new Error('Cannot set a time range with most recent time ' + helpers.convertDateTime(uppertimelimit) +
             ' less than oldest time' + helpers.convertDateTime(lowertimelimit));
  }
}
//----------------------------------------------------------------------------
// ussage
//----------------------------------------------------------------------------
function usage() {
  console.log('\n\n');
  console.log('Usage : node mongologreader [-l=maxlog] [-m=modulename] [-ut=<valid-date>] [-ut=<valid-date>]');
  console.log('[] maxlog is the xaximum number of log events reported.');
  console.log('[] modulename is the name of a module which logged in mongo repository.');
  console.log('[] -ut specifies the most recent time to be considered');
  console.log('[] -lt specifies the oldest time to be considered');
  console.log('[]     valid-date defines the latest date to consider. All events posted before this date will not be read.');
  console.log('[]            Format must be either \"mon-dd-yyyy hh:mm\". or hh:mm');
  console.log('[]            Notice the surrounding \"\" when a full date is specified');
  console.log('\n\n');
}
//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
try {
  parseCommandLine();
}
catch(Error) {
    console.log('\n\n********** Error : ' + Error);
    usage();
    process.exit(1);
}
// Get a connection
mongo.getMongoDBConnection();
// Builds the query
let query = Mongolog.find({ });
query.select('module message timestamp severity').sort({timestamp: -1});  // Sorted by most recent dates
// Any specific module wanted ? 
if (modulename !== null) {
  query.select().where('module').equals(modulename); 
}
// Any recent time ? 
if(uppertimelimit) {  
  query.select().where('timestamp').gt(uppertimelimit);
}
// Any oldest time ? 
if(lowertimelimit) {  
  query.select().where('timestamp').lt(lowertimelimit);
}
// Any limit to number of lines ?
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
