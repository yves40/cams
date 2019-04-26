//----------------------------------------------------------------------------
//    useradmin.js
//
//    Apr 24 2019    Initial
//    Apr 26 2019    Input from a json file
//----------------------------------------------------------------------------

const Version = "useradmin.js:1.11 Apr 26 2019 ";

const user = require('../src/classes/user');
const logger = require("../src/utilities/logger");
var readline = require('readline-sync');
const helpers = require("../src/utilities/helpers");
const mongo = require("../src/utilities/mongo");

var fs = require("fs");

let command = undefined;
let thefile = undefined;
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
        case '-add':
                    command = 'ADD';
                    validparam = true;
                    break;
        case '-delete':
                    command = 'DEL';
                    validparam = true;
                    break;
        case '-update': 
                    command = 'UPD';
                    validparam = true;
                    break;
        case '-f': 
                    thefile = process.argv[++index];
                    validparam = true;
                    break;
        default: 
                    validparam = false;
                    break;
      }
      if (!validparam) {throw new Error('Invalid parameter : ' + keyword);}
      ++index;
      value = keyword = undefined; // Next loop
    }
    if (!command) {throw new Error('No command specified ( add | delete | update ) ');}
    if(thefile === undefined) {throw new Error('No json file input')}
};


//----------------------------------------------------------------------------
// ussage
//----------------------------------------------------------------------------
function usage() {

    console.log('\n\n');
    console.log('Usage : node useradmin -list | -add | -delete | -update  -f jsonuserfile \n');
    console.log('[]');
    console.log('[] Samples');
    console.log('[]');
    console.log('\n\n');
}

//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
try {

    console.log('\n\n');
    logger.infos(Version);
    
    parseCommandLine();
    // Get a connection
    mongo.getMongoDBConnection();
    // Get the json file
    let jsondata = fs.readFileSync(thefile);
    var jsonContent = JSON.parse(jsondata);
    switch(command) {
      case 'ADD': console.log('Adding user(s)');
        createUsers(jsonContent);
        break;
      case 'UPD': console.log('Updating user(s)');
        updateUsers(jsonContent);
        break;
      case 'DEL': console.log('Deleting user(s)');
        removeUsers(jsonContent);
        break;
    }

    (async() => {
      await helpers.sleep(3000);    // Wait for mongo to flush cache
      process.exit(0);
    })();
    }
catch(Error) {
    console.log('\n\n********** Error : ' + Error);
    usage();
    process.exit(1);
}
//----------------------------------------------------------------------------
// Create users
//----------------------------------------------------------------------------
function createUsers(jsonContent) {
  let i = 0;
  for (i in jsonContent) {
    console.log('____________________________________________');
    console.log('Processing user : ' + jsonContent[i].email);
    let newuser = new user();  
    newuser.createUser(jsonContent[i]);
    console.log('    Save : ' + newuser.usermodel.email);
  }
}
//----------------------------------------------------------------------------
// Update users
//----------------------------------------------------------------------------
function updateUsers(jsonContent) {
  let i = 0;
  for (i in jsonContent) {
    console.log('____________________________________________');
    console.log('Processing user : ' + jsonContent[i].email);
    let newuser = new user();  
    newuser.updateUser(jsonContent[i]);
    console.log('    Updated : ' + newuser.User.email);
  }
}
//----------------------------------------------------------------------------
// Update users
//----------------------------------------------------------------------------
function removeUsers(jsonContent) {
  let i = 0;
  for (i in jsonContent) {
    console.log('____________________________________________');
    console.log('Processing user : ' + jsonContent[i].email);
    let newuser = new user(jsonContent[i].email);
    newuser.removeUser();
  }
}

