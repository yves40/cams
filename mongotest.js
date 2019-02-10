//----------------------------------------------------------------------------
//    mongotest.js
//
//    Jan 10 2019    Initial
//----------------------------------------------------------------------------

const Version = "mongotest.js: Jan 10 2019, 1.06 ";

const myenv = require("./config/myenv");  

const mongoose = require('mongoose');

console.log('\n\n' + Version + '----------------- mongotest -------------------------------\n\n');

//----------------------------------------------------------------------------
// Connect to mongo 
//----------------------------------------------------------------------------
console.log('Using ' + myenv.getVersion());
console.log('Connect to : ' + myenv.getMongoDB());
mongoose.connect(myenv.getMongoDB(), 
  { useNewUrlParser: true,
    reconnectTries: 3, 
    reconnectInterval: 1000,
    keepAlive: true,
  })
  .then(
    () => {
      console.log('\t\t\tmongodb up and running');
      process.exit(0);
    }, 
    err => {
      console.error('\t\t\tProblem during mongo connection on mongodb');
      console.log(err.message);
      process.exit(1);
    }
  )
console.log('Mongo status : ' + myenv.getMongoDBStatus());
mongoose.connection.close()
console.log('Done');
