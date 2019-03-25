//----------------------------------------------------------------------------
//    mongologger.js
//
//    Mar 24 2019   Initial
//    Mar 25 2019   WIP on methods
//----------------------------------------------------------------------------
"use strict"

const Mongolog = require ('../models/mongoLogModel');
const mongo = require ('../utilities/mongo');
const logger = require ('../utilities/logger');
const DELAY = 500; // msec

//----------------------------------------------------------------------------
// The class 
//----------------------------------------------------------------------------
module.exports = class mongologger {
  constructor (modulename, syncmode = false) {
      this.Version = 'mongologger:1.12, Mar 25 2019 ';
      this.modulename = modulename;   // Used to track the calling component
      this._DB = mongo.getMongoDBConnection();
      if (syncmode) waitmongoconnection();
  };

  log(message) {
    let themessage = new Mongolog( { message: message, 
                                    timestamp: Date.now(),
                                    type: this.modulename, });
    themessage.save(function (err, themessage) {
      if (err) return console.error(err);
      console.log(themessage.message + " saved to mongologs collection.");
    });  
  };

  getVersion() {
    return this.Version;
  };
}

//----------------------------------------------------------------------------
// Private 
//----------------------------------------------------------------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function  waitmongoconnection() {
  while (mongo.getMongoDBStatus() !== mongo.CONNECTED) {
    logger.debug(mongo.getMongoDBStatusText() + ' [' + mongo.getMongoDBStatus() + ']');
    await sleep(DELAY);    // 1/2 sec tempo
  }
}
