//----------------------------------------------------------------------------
//    scanuserlog.js
//
//    Apr 03 2019    Initial, from simplemongologgertest
//----------------------------------------------------------------------------

const Version = "scanuserlog.js:1.01 Apr 03 2019 ";

const objectid = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const userLog = require('../src/models/userLogModel');;
const logger = require("../src/utilities/logger");
const helpers = require("../src/utilities/helpers");
const mongo = require("../src/utilities/mongo");
const User = require('../src/models/userModel');

console.log('\n\n');
logger.infos(Version + 'Start search ');

let useremail = undefined;
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
}
catch(Error) {
    console.log('\n\n********** Error : ' + Error);
    usage();
    process.exit(1);
}
logger.infos('Searching log history for user : ' + useremail);
// Get a connection
mongo.getMongoDBConnection();
// Builds the query
let query = User.find({});
query.select('email').where('email').equals(useremail);
// Run
(async() => {
    await query.exec(function(err, thelist) {
        if (err) console.log(err);
        else {
          thelist.forEach((value, index) => {
            console.log('[ %s ] %s %s', ('000'+index).slice(-3), 
                value.email,
                (value._id.toString(16).substr(-32)).toUpperCase()
              );
          });
        }
        process.exit(0);
    });
})();

