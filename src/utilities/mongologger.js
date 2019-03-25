//----------------------------------------------------------------------------
//    mongologger.js
//
//    Mar 24 2019   Initial
//----------------------------------------------------------------------------
"use strict"

const Mongolog = require ('../models/mongoLogModel');
const mongo = require ('../utilities/mongo');

module.exports = class mongologger {
  
  constructor (modulename) {
    this.Version = 'mongologger:1.04, Mar 24 2019 ';
    this.modulename = modulename;   // Used to track the calling component
    this._DB = mongo.getMongoDBConnection();
  };

  log(message) {
    let themessage = new Mongolog( { message: message, 
                                    timestamp: Date.now(),
                                    type: this.modulename, });
    themessage.save();
  };

  getVersion() {
    return this.Version;
  };
}
