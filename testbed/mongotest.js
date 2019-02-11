//----------------------------------------------------------------------------
//    mongotest.js
//
//    Feb 10 2019    Initial
//    Feb 11 2019    Tests
//----------------------------------------------------------------------------

const Version = "mongotest.js: Feb 11 2019, 1.08 ";

const myenv = require("../config/myenv");  

const mongoose = require('mongoose');

console.log('\n\n' + Version + '----------------- mongotest -------------------------------\n\n');

//----------------------------------------------------------------------------
// Connect to mongo 
//----------------------------------------------------------------------------
console.log('Using ' + myenv.getVersion());
console.log('Connect to : ' + myenv.getMongoDBURI());
mongoose.connect(myenv.getMongoDBURI(), 
  { useNewUrlParser: true,
    reconnectTries: 3, 
    reconnectInterval: 1000,
    keepAlive: true,
  })
  .then(
    () => {
      console.log('mongodb up and running');
      console.log('-------------------------');
      console.log('Mongo status : ' + myenv.getMongoDBStatus());
      mongoose.connection.close();
      process.exit(0);
    }, 
    err => {
      console.error('\t\t\tProblem during mongo connection on mongodb');
      console.log('Mongo status : ' + myenv.getMongoDBStatus());
      console.log(err.message);
      process.exit(1);
    }
  )
