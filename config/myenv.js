//----------------------------------------------------------------------------
//    myenv.js
//
//    Dec 02 2018   Initial
//    Dec 03 2018   Prefix not hard coded
//    Dec 07 2018   Problem with mono node config and CORS
//    Jan 16 2019   Start working on services in the CAMS app
//    Jan 17 2019   Port 8081
//    Jan 21 2019   CORS
//    Jan 22 2019   Remove some logging
//    Feb 01 2019   Extract CORS to cors.js
//    Feb 10 2019   mongodb param here
//                  Work on mongo status
//    Feb 11 2019   mongo status check
//                  Change mongo URI to remote node
//    Feb 21 2019   WIP on mongodb status check
//----------------------------------------------------------------------------
const Version = "myenv:1.43, Feb 21 2019 ";

var mongoose = require('mongoose');

const mongodb = 'mongodb://vboxweb:4100/cams';
// URL prefix used to call the services node
const prefix = process.env.NODEURLPREFIX || "http://vboxweb:8081";
// For the server.js
const port = "8081";

module.exports.getMode = function getMode() {
  const devmode = process.env.NODEDEVMODE || "true";
  if (devmode.toUpperCase() === "TRUE") {
    return "DEV";
  } else {
    return "PROD";
  }
};
module.exports.getURLprefix = function getURLprefix() {
  if (this.getMode() === "DEV") {
    return prefix;
  } else {
    return "";
  }
};
module.exports.getPrefixSource = function getPrefixSource() {
  if (process.env.NODEURLPREFIX) {
    return "From shell";
  } else {
    return "From javascript";
  }
};
module.exports.getVersion = function getVersion() {
  return Version;
};

module.exports.getPort = function getPort() {
  return port;
};

module.exports.getMongoDBURI = function getMongoDBURI() {
  return mongodb;
};

/*
  Check mongodb state
  0: disconnected
  1: connected
  2: connecting
  3: disconnecting
*/
const DOWN = false;
const UP = true;
const UNKNOWN = false;
let connected = false;

module.exports.getMongoDBStatus = function getMongoDBStatus() {
  console.log(Version + 'Test mongodb status now');
  try {
    mongoose.connect(mongodb, {useNewUrlParser: true, keepAlive: false});
    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;
    //Get the default connection
    var db = mongoose.connection;
    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));    
  }
  catch(err) {
    console.log(Version + 'CRASH');
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