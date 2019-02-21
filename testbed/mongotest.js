//----------------------------------------------------------------------------
//    mongotest.js
//
//    Feb 10 2019    Initial
//    Feb 11 2019    Tests
//    Feb 21 2019    mongodb synchronous call...
//----------------------------------------------------------------------------

const Version = "mongotest.js: Feb 21 2019, 1.11 ";

const myenv = require("../config/myenv");  

const mongoose = require('mongoose');

console.log('\n\n' + Version + '----------------- mongotest -------------------------------\n\n');

//----------------------------------------------------------------------------
// Connect to mongo 
//----------------------------------------------------------------------------
console.log('Using ' + myenv.getVersion());
console.log('Connect to : ' + myenv.getMongoDBURI());
console.log('Mongo status : ' + myenv.getMongoDBStatus());
