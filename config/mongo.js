//----------------------------------------------------------------------------
//    mongo.js
//
//    Mar 01 2019   Initial
//----------------------------------------------------------------------------
const Version = "mongo:1.09, Mar 01 2019 ";

var mongoose = require('mongoose');

const mongodb = 'mongodb://vboxweb:4100/cams';
//----------------------------------------------------------------------------
// Version
//----------------------------------------------------------------------------
module.exports.getVersion = function getVersion() {
  return Version;
}

//----------------------------------------------------------------------------
// Where's mongo server ?
//----------------------------------------------------------------------------
module.exports.getMongoDBURI = function getMongoDBURI() {
  return mongodb;
};

/*
  Check mongodb state
  0: disconnected
  1: connected
  2: connecting
  3: disconnecting

  module.exports = Object.freeze( {
   DISCONNECTED: 0,
   CONNECTED : 1,
   CONNECTING : 2,
   DISCONNECTING : 3,
});

  */
const DISCONNECTED = 0;
const CONNECTED = 1;
const CONNECTING = 2;
const DISCONNECTING = 3; 

module.exports.DISCONNECTED = DISCONNECTED;
module.exports.CONNECTED = CONNECTED;
module.exports.CONNECTING = CONNECTING;
module.exports.DISCONNECTING = DISCONNECTING;

let DB = null;

//----------------------------------------------------------------------------
// Open mongo connection
//----------------------------------------------------------------------------
module.exports.getMongoDBConnection = function getMongoDBConnection() {
  console.log(Version + 'Connect to : ' + mongodb);
  try {
    mongoose.connect(mongodb, {useNewUrlParser: true, keepAlive: false});
    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;
    DB = mongoose.connection;
    return DB;
  }
  catch(err) {
    console.log(Version + err);
  }
};
//----------------------------------------------------------------------------
// Get mongo status
//----------------------------------------------------------------------------
module.exports.getMongoDBStatus = function getMongoDBStatus() {
  return DB.readyState;
};


/*
    mongoose.connection.on('open', function (ref) {
      connected=true;
      console.log('open connection to mongo server.');
    });
    mongoose.connection.on('connected', function (ref) {
      connected=true;
      console.log('connected to mongo server.');
    });
    
    mongoose.connection.on('disconnected', function (ref) {
      connected=false;
      console.log('disconnected from mongo server.');
    });
    
    mongoose.connection.on('close', function (ref) {
      connected=false;
      console.log('close connection to mongo server');
    });  
    mongoose.connection.on('error', function (err) {
      connected=false;
      console.log('error connection to mongo server!');
      console.log(err);
    });
    mongoose.connection.db.on('reconnect', function (ref) {
      connected=true;
      console.log('reconnect to mongo server.');
    });

*/