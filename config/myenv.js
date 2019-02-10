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
//----------------------------------------------------------------------------
const Version = "myenv:1.29, Feb 10 2019 ";
var mongoose = require('mongoose');

const DOWN = false;
const UP = true;
const mongodb = 'mongodb://localhost:4100/cams';
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

module.exports.getMongoDB = function getMongoDB() {
  return mongodb;
};

/*
  Check mongodb state
  0: disconnected
  1: connected
  2: connecting
  3: disconnecting
*/
module.exports.getMongoDBStatus = function getMongoDBStatus() {
  switch(mongoose.connection.readyState) {
    case 0:   return DOWN;
              break;
    case 1:  return UP;
              break;
  }
};

