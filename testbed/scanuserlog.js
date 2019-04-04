//----------------------------------------------------------------------------
//    scanuserlog.js
//
//    Apr 03 2019    Initial, from simplemongologgertest
//    Apr 04 2019    Add info, qualifiers and format listing
//----------------------------------------------------------------------------

const Version = "scanuserlog.js:1.12 Apr 04 2019 ";

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
let loglimit = undefined;
let verbose = true;
let userids = [];       // All users to get log from 
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
        case '-l':  
                    value = process.argv[++index];
                    if (value === undefined) {
                      throw new Error('You specified ' + keyword + ' without any value');
                    }
                    loglimit = parseInt(value);
                    validparam = true;
                    break;
        case '-s':  verbose = false;   // Silent mode ?
                    validparam = true;
                    break;
      }
      if (!validparam) {throw new Error('Invalid parameter : ' + keyword);}
      ++index;
      value = keyword = undefined; // Next loop
    }
};


//----------------------------------------------------------------------------
// ussage
//----------------------------------------------------------------------------
function usage() {

    console.log('\n\n');
    console.log('Usage : node scanuserlog [-mail <usermail>] [-l maxlog] [-s] \n');
    console.log('[] maxlog is the maximum number of log events reported.');
    console.log('[] -s silent mode');
    console.log('\n\n');
}
  
//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
try {

    parseCommandLine();
    if (verbose&&useremail) logger.infos('Searching log history for user : ' + useremail);
    // Get a connection
    mongo.getMongoDBConnection();
    // Builds the query to find the user
    let query = User.find({});
    query.select('email'); 
    if(useremail) query.select().where('email').equals(useremail);
    // Search users
    (async() => {
        let userids = await getUserIds(query);
        console.log('userids contains ' + userids.length + ' entries');
        await getUserLogs(userids);
        // process.exit(0);
    })();
}
catch(Error) {
    console.log('\n\n********** Error : ' + Error);
    usage();
    process.exit(1);
}
//----------------------------------------------------------------------------
// Get user ID list
//----------------------------------------------------------------------------
async function getUserIds(query) {
    await query.exec(function(err, thelist) {
        if (err) console.log(err);
        if(thelist.length === 0) {
            logger.error('No matching user for ' + useremail);
        }
        else {
            thelist.forEach((value, index) => {
                userids.push(value._id);
                console.log('\n[ %s ] %s %s', ('000'+index).slice(-3), 
                    value.email,
                    (value._id.toString(16).substr(-32)).toUpperCase()
                    );
            });
            return new Promise(resolve => { resolve(userids)});
        }
    });
}
//----------------------------------------------------------------------------
// Get logs for one user
//----------------------------------------------------------------------------
async function getUserLogs(userids) {

    userids.forEach( (userid) => {
        if (verbose) logger.infos('Browse the userlogs collection with user ID : ' + userid);
        (async() => {
            let querylog = userLog.find({});
            querylog.select('email action timestamp ip severity').sort({timestamp: -1});
            querylog.select().where('userid').equals(userid);
            await querylog.exec( function (err, loglist) {
                if (err) console.log(err);
                if (verbose) logger.infos('Found ' + loglist.length + ' entries\n\n');
                loglist.forEach((value, index) => {
                    // Some formatting
                    let IP = 'Not collected'.padEnd(24, ' ');
                    if(value.ip) {
                        IP = value.ip.padEnd(24, ' ');
                    }
                    console.log('%s %s %s %s', helpers.convertDateTime(value.timestamp), 
                                IP,
                                value.action.padEnd(35, ' '),
                                value.email);
                });
            });
        })();    
    });
}

