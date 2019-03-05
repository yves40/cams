//----------------------------------------------------------------------------
//    mongo.js
//
//    Mar 01 2019   Initial
//    Mar 05 2019   Monitor mongo connection status with DB.on()
//                  Add mongodown test routine
//----------------------------------------------------------------------------
const Version = "mongo:1.14, Mar 05 2019 ";

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

    DB.on('error',function (err) {  
      console.log(Version + 'Mongoose error: ' + err);
    }); 
    DB.on('disconnected',function () {  
      console.log(Version + 'Mongoose disconnected');
    }); 
    DB.on('connected',function () {  
      console.log(Version + 'Mongoose connected');
    }); 
    
    return DB;
  }
  catch(err) {
    console.log(Version + err);
  }
};
//----------------------------------------------------------------------------
// Get mongo detailed status
//----------------------------------------------------------------------------
module.exports.getMongoDBStatus = function getMongoDBStatus() {
  return DB.readyState;
};
//----------------------------------------------------------------------------
// Get mongo runnable status
//----------------------------------------------------------------------------
module.exports.getMongoDBFlag = function getMongoDBFlag() {
  switch ( DB.readyState ) {
    case DISCONNECTED:
    case CONNECTING:
    case DISCONNECTING:
      return false;
      break;
    case CONNECTED:
      return true;
      break;
  }
};
//----------------------------------------------------------------------------
// mongo is down ? 
//----------------------------------------------------------------------------
module.exports.IsMongoDown = function IsMongoDown() {
  switch ( DB.readyState ) {
    case DISCONNECTED:
    case CONNECTING:
    case DISCONNECTING:
      return true;
    case CONNECTED:
      return false;
    default:
      return false;
  }
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