//----------------------------------------------------------------------------
//    mongo.js
//
//    Mar 01 2019   Initial
//    Mar 05 2019   Monitor mongo connection status with DB.on()
//                  Add mongodown test routine
//    Mar 06 2019   Code Cleanup
//    Mar 25 2019   Test new connection method
//    Mar 30 2019   Remove some log message
//----------------------------------------------------------------------------
const Version = "mongo:1.21, Mar 30 2019 ";

var mongoose = require('mongoose');
const logger = require('./logger');

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
module.exports.getMongoDBConnection = function getMongoDBConnection(traceflag = false) {
  if(traceflag) logger.debug(Version + 'Connect to : ' + mongodb);
  try {
    mongoose.connect(mongodb,{useNewUrlParser: true, keepAlive: false } )
    .then(function(MongooseObject) {
      if(traceflag) logger.info('Mongoose now ready [' + MongooseObject.connection.readyState + ']');
      return MongooseObject.connection;
    })
    .catch(function(reason) {
      logger.info(reason.message);
    });
  
    DB = mongoose.connection;
      // Set up handlers
      DB.on('error',function (err) {  
        if(traceflag) logger.error(Version + 'Mongoose error: ' + err);
      }); 
      DB.on('disconnected',function () {  
        if(traceflag) logger.debug(Version + 'Mongoose disconnected');
      }); 
      DB.on('connected',function () {  
        if(traceflag) logger.debug(Version + 'Mongoose connected');
      }); 
      return DB;
  }
  catch(error) {
    throw error;
  }
};
//----------------------------------------------------------------------------
// Open mongo connection
//----------------------------------------------------------------------------
module.exports.closeMongoDBConnection = function closeMongoDBConnection() {
  mongoose.disconnect();
};
//----------------------------------------------------------------------------
// Get mongo raw status
//----------------------------------------------------------------------------
module.exports.getMongoDBStatus = function getMongoDBStatus() {
  return DB.readyState;
};
//----------------------------------------------------------------------------
// Get mongo status in human readable format
//----------------------------------------------------------------------------
module.exports.getMongoDBStatusText = function getMongoDBStatusText() {
  switch ( DB.readyState ) {
    case DISCONNECTED:
      return('Disconnected');
    case CONNECTED:
      return( 'Connected');
    case CONNECTING:
      return( 'Connecting');
    case DISCONNECTING:
      return( 'Disconnecting');
    default: return('Unknown')
  }
};
//----------------------------------------------------------------------------
// Get mongo runnable status
// TRUE if connected
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
    default:
      return false;
  }
};
//----------------------------------------------------------------------------
// mongo is down ? 
// TRUE if disconnected
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
