//----------------------------------------------------------------------------
//    mongotest.js
//
//    Jan 10 2019    Initial
//----------------------------------------------------------------------------

const Version = "mongotest.js: Jan 10 2019, 1.02 ";

const jwtconfig = require("./config/jwtconfig");  

const mongoose = require('mongoose');

console.log();
console.log(Version + '----------------- mongotest -------------------------------');

//----------------------------------------------------------------------------
// Connect to mongo 
//----------------------------------------------------------------------------
console.log('Connect to : ' + jwtconfig.mongodb);
mongoose.connect(jwtconfig.mongodb, 
  { useNewUrlParser: true,
    reconnectTries: 3, 
    reconnectInterval: 1000,
    keepAlive: true,
  })
  .then(
    () => {
      console.log('\t\t\tmongodb up and running');
    }, 
    err => {
      console.error('\t\t\tProblem during mongo connection on mongodb');
      console.log(err.message);
      process.exit(1);
    }
  )
console.log('Done');
