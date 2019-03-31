//----------------------------------------------------------------------------
//    mongologreader.js
//
//    Mar 27 2019     Initial, from mongologgertest
//    Mar 28 2019     Query problems
//    Mar 30 2019     Fix time range bug
//    Mar 31 2019     Change qualifiers
//                    Add -s for silent
//----------------------------------------------------------------------------

const Version = "mongologreader.js:1.19 Mar 31 2019 ";

const mongo = require('../src/utilities/mongo');
const helpers = require('../src/utilities/helpers');
const logger = require("../src/utilities/logger");
const Mongolog = require ('../src/models/mongoLogModel');

const ObjectId = require('mongodb').ObjectId;

let loglimit = null;
let beforetime = null;
let aftertime = null;
let modulename = null;
let verbose = true;
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
        if (value !== undefined) {
          switch(keyword) {
            case '-before': if (value.length < 6) {
                          // Expect user specified just hh:mm, so add current day month year
                          value = helpers.getDate() + ' ' + value;                       
                        }
                        beforetime = new Date(value);
                        validparam = true;
                        break;
            case '-after': if (value.length < 6) {
                        // Expect user specified just hh:mm, so add current day month year
                        value = helpers.getDate() + ' ' + value;                       
                        }
                        aftertime = new Date(value);
                        validparam = true;
                        break;
            case '-l':  loglimit = parseInt(value);
                        validparam = true;
                        break;
            case '-m':  modulename = value;
                        validparam = true;
                        break;
          }
        }
        else { // Value less parameters
          switch(keyword) {
            case '-s':  verbose = false;   // Silent mode ?
                        validparam = true;
                        break;
          }
        }
        if (!validparam) {
          throw new Error('Invalid parameter : ' + keyword);
        }
      }
    };
  });
  if((aftertime && beforetime)&&(aftertime > beforetime)) {
      throw new Error('Cannot set a time range between ' + helpers.convertDateTime(beforetime) +
             ' and ' + helpers.convertDateTime(aftertime));
  }
  if(verbose&&aftertime&&beforetime) {
    logger.info(Version + 'Searching for logs after ' + helpers.convertDateTime(aftertime) + ' and before ' + helpers.convertDateTime(beforetime));
  }
  else {
    if(verbose&&beforetime) logger.info(Version + 'Searching for logs before ' + helpers.convertDateTime(beforetime));
    if(verbose&&aftertime) logger.info(Version + 'Searching for logs after ' + helpers.convertDateTime(aftertime));
  }
  if(verbose&&loglimit) logger.info(Version + 'Will report no more than ' + loglimit + ' lines');
  if(verbose&&modulename) logger.info(Version + 'Searching for module ' + modulename)
}
//----------------------------------------------------------------------------
// ussage
//----------------------------------------------------------------------------
function usage() {

  console.log('\n\n');
  console.log('Usage : node mongologreader [-l=maxlog] [-m=modulename] [-before=<valid-date>] [-after=<valid-date>] [-s] \n');
  console.log('[] maxlog is the xaximum number of log events reported.');
  console.log('[] modulename is the name of a module which logged in mongo repository. The search is case insensitive');
  console.log('[] -before specifies a search for logs before a date');
  console.log('[] -after specifies a search for logs after a date');
  console.log('[]     valid-date defines the latest date to consider. All events posted before this date will not be read.');
  console.log('[]            Format must be either \"mon-dd-yyyy hh:mm\". or hh:mm');
  console.log('[]            Notice the surrounding \"\" when a full date is specified');
  console.log('[]     after and before can be used together to specify a time range. ');
  console.log('[] -s silent mode');
  console.log('[]');
  console.log('[] Samples');
  console.log('[]');
  console.log('[] node mongologreader.js -after="Mar-28-2019 10:14" -before="Mar-28-2019 09:28" -s');
  console.log('[] node mongologreader.js -m=SERVER.JS');
  console.log('[] node mongologreader.js -before="Mar-28-2019 10:14" -after="Mar-28-2019 09:28" -s');
  console.log('[] node mongologreader.js -after=mar-31-2019');

  console.log('\n\n');
}
//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
console.log('\n');
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
console.log('\n\n');
// Builds the query
let query = Mongolog.find({ });
query.select('module message timestamp severity').sort({timestamp: -1});  // Sorted by most recent dates
// Any specific module wanted ? 
if (modulename !== null) {
  query.select().where({ 'module' : { '$regex' : modulename, '$options' : 'i' } });
}
// Any time range  ? Must be : before MAR 31 ------ after MAR 26 
if(beforetime && aftertime) {  
  query.select().where('timestamp').gt(aftertime).where('timestamp').lt(beforetime);
}
else {
  // Any recent time ? Must be : after MAR 31 
  if(aftertime) {  
    query.select().where('timestamp').gt(aftertime);
  }
  // Any oldest time ? Must be : before MAR 31
  if(beforetime) {  
    query.select().where('timestamp').lt(beforetime);
  }
}
// Any limit to number of lines ?
if (loglimit) {
  query.limit(loglimit);
}
// Finally run the buit query
(async() => {
  await query.exec(function(err, thelist) {
    if (err) console.log(err);
    else {
      thelist.forEach((value, index) => {
        // index = index.toString();
        ;
        console.log('[ %s ] %s %s ------ %s', ('000'+index).slice(-3), 
          helpers.convertDateTime(value.timestamp), 
          value.module, 
          value.message );
      });
    }
    process.exit(0);
  });
})();
