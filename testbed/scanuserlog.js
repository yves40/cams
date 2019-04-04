//----------------------------------------------------------------------------
//    scanuserlog.js
//
//    Apr 03 2019    Initial, from simplemongologgertest
//----------------------------------------------------------------------------

const Version = "scanuserlog.js:1.06 Apr 03 2019 ";

const objectid = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const User = require('../src/models/userModel');
const userLog = require('../src/models/userLogModel');
const logger = require("../src/utilities/logger");
const helpers = require("../src/utilities/helpers");
const mongo = require("../src/utilities/mongo");

console.log('\n\n');
logger.infos(Version + 'Start search ');

let useremail = undefined;
let userid = undefined;
let validparam = false;
//----------------------------------------------------------------------------
// Parse command line args
//----------------------------------------------------------------------------
function parseCommandLine() {
    let index = 0;
    let value = undefined;
    let nbrargs = process.argv.length - 2;
    for (index = 2; index < process.argv.length; ) {
      let keyword = process.argv[index];
      switch(keyword) {
        case '-mail':
                    value = process.argv[++index];
                    if (value === undefined) {
                      throw new Error('You specified ' + keyword + ' without any value');
                    }
                    useremail = value;
                    validparam = true;
                    break;
      }
      if (!validparam) {throw new Error('Invalid parameter : ' + keyword);}
      ++index;
      value = keyword = undefined; // Next loop
    }
    if (useremail === undefined) {throw new Error('No user email specified, provide one please');}
};


//----------------------------------------------------------------------------
// ussage
//----------------------------------------------------------------------------
function usage() {

    console.log('\n\n');
    console.log('Usage : node scanuserlog -mail <usermail> \n');
    console.log('\n\n');
}
  
//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
try {

    parseCommandLine();
    logger.infos('Searching log history for user : ' + useremail);
    // Get a connection
    mongo.getMongoDBConnection();
    // Run
    (async() => {
        // Builds the query to find the user
        let query = User.find({});
        query.select('email').where('email').equals(useremail);
        await query.exec(function(err, thelist) {
            if (err) console.log(err);
            if(thelist.length === 0) {
                logger.error('No matching user for ' + useremail);
            }
            else {
                thelist.forEach((value, index) => {
                    userid = value._id;
                    console.log('\n[ %s ] %s %s', ('000'+index).slice(-3), 
                        value.email,
                        (value._id.toString(16).substr(-32)).toUpperCase()
                        );
                    });
            }
            logger.infos('Browse the userlogs collection with user ID : ' + userid);
            (async() => {
                let querylog = userLog.find({});
                querylog.select('email action timestamp ip severity').sort({timestamp: -1});
                querylog.select().where('userid').equals(userid);
                await querylog.exec( function (err, loglist) {
                    if (err) console.log(err);
                    logger.infos('Found ' + loglist.length + ' entries\n\n');
                    loglist.forEach((value, index) => {
                        // Some formatting
                        let IP = 'Not collected'.padStart(24, ' ');
                        if(value.ip) {
                            IP = value.ip.padStart(24, ' ');
                        }
                        console.log('%s %s %s %s', helpers.convertDateTime(value.timestamp), 
                                    IP,
                                    value.action.padStart(35, ' '),
                                    value.email);
                    });
                    process.exit(0);    
                });
            })();
        });
    })();
}
catch(Error) {
    console.log('\n\n********** Error : ' + Error);
    usage();
    process.exit(1);
}

