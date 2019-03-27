//----------------------------------------------------------------------------
//    mongologger.js
//
//    Mar 24 2019   Initial
//    Mar 25 2019   WIP on methods
//    Mar 27 2019    Playing with async & Promise...
//----------------------------------------------------------------------------
"use strict"

const Mongolog = require ('../models/mongoLogModel');
const mongo = require ('../utilities/mongo');
const logger = require ('../utilities/logger');

//----------------------------------------------------------------------------
// The class 
//----------------------------------------------------------------------------
module.exports = class mongologger {
  constructor (modulename) {
      this.Version = 'mongologger:1.19, Mar 27 2019 ';
      this.DEBUG = 0;
      this.INFORMATIONAL = 1;
      this.WARNING = 2;
      this.ERROR = 3;
      this.FATAL = 4;
      this.modulename = modulename;   // Used to track the calling component
      this._DB = mongo.getMongoDBConnection();
  };
  //----------------------------------------------------------------------------
  async log(message, severity = this.DEBUG) {
    message = '[' + this.levelToString(severity) + ']' + message;
    let themessage = new Mongolog( { module: this.modulename,
                                    message: message, 
                                    timestamp: Date.now(),
                                    severity: severity, });
    await themessage.save().then( value => {
        logger.debug(this.Version + themessage.message + ' : ----------------- Saved');
    })
    .catch( value => {
      logger.error(themessage.message + ' : -----------------  Not Saved !!!!!!!!!!!!!');
    }); 
  };
  //----------------------------------------------------------------------------
  levelToString(level) {
    switch (level) {
        case this.DEBUG: return 'DBG';
        case this.INFORMATIONAL: return 'INF';
        case this.WARNING: return 'WRN';
        case this.ERROR: return 'ERR';
        case this.FATAL: return 'FTL';
        default: return 'FTL';
    }
  };  
  //----------------------------------------------------------------------------
  static getVersion() {
    return this.Version;
  };
};
//----------------------------------------------------------------------------
// Private 
//----------------------------------------------------------------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
