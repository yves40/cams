//----------------------------------------------------------------------------
//    mongotest.js
//
//    Feb 10 2019    Initial
//    Feb 11 2019    Tests
//    Feb 21 2019    mongodb synchronous call...
//    Feb 28 2019    WIP on mongodb connection checking
//    Mar 01 2019    WIP on mongodb connection checking II
//    Mar 02 2019    mongodb connection checking III
//                   Async functions
//    Mar 03 2019    mongodb connection checking IV
//----------------------------------------------------------------------------

const Version = "mongotest.js:1.28 Mar 03 2019 ";

const mongo = require("../config/mongo");  

const INTERVAL = 4000;
const LOOPS = 10;
let _DB = null;

console.log('\n\n' + Version + '----------------- mongotest -------------------------------\n\n');

//----------------------------------------------------------------------------
// Super sleep function ;-)
//----------------------------------------------------------------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//----------------------------------------------------------------------------
// Connect to mongo 
//----------------------------------------------------------------------------
console.log(Version + 'Using ' + mongo.getVersion());
_DB = mongo.getMongoDBConnection();
_DB.on('error',function () {  
  console.log('Mongoose default connection error: ');
}); 
_DB.on('disconnected',function () {  
  console.log('Mongoose disconnected: ');
}); 
_DB.on('connected',function () {  
  console.log('Mongoose connected: ');
}); 

let iter = 1;
//----------------------------------------------------------------------------
// Go
//----------------------------------------------------------------------------
checkMongo();

//----------------------------------------------------------------------------
// Check status
//----------------------------------------------------------------------------
async function checkMongo() {

  while (iter < LOOPS+1) {
    await sleep(INTERVAL);
    let status = mongo.getMongoDBStatus();
    switch ( status ) {
      case mongo.DISCONNECTED:
        console.log(Version + 'Disconnected' + '[' + iter + ']');
        break;
      case mongo.CONNECTED:
        console.log(Version + 'Connected' + '[' + iter + ']');
        break;
      case mongo.CONNECTING:
        console.log(Version + 'Connecting' + '[' + iter + ']');
        break;
      case mongo.DISCONNECTING:
        console.log(Version + 'Disconnecting' + '[' + iter + ']');
        break;
    }
    ++iter;
  }
  console.log(Version + 'Exit now after ' + --iter + ' iterations');
  process.exit(0);
}