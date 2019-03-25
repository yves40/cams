//----------------------------------------------------------------------------
//    mongologger.js
//
//    Mar 24 2019   Initial
//    Mar 25 2019   WIP on methods
//----------------------------------------------------------------------------
"use strict"

const Mongolog = require ('../models/mongoLogModel');
const mongo = require ('../utilities/mongo');

//----------------------------------------------------------------------------
// The class 
//----------------------------------------------------------------------------
module.exports = class mongologger {
  constructor (modulename, syncmode = false) {
      this.Version = 'mongologger:1.09, Mar 25 2019 ';
      this.modulename = modulename;   // Used to track the calling component
      this._DB = mongo.getMongoDBConnection();
  };

  log(message) {
    console.log(this.Version + 'Mongo status : ' + mongo.getMongoDBStatusText());
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

  closeDB() {
    mongo.closeMongoDBConnection();
  };
}

//----------------------------------------------------------------------------
// Private 
//----------------------------------------------------------------------------
/*
function sleep(ms) {
  console.log('Wait for ' + ms / 1000 + ' sec');
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function  waitmongoconnection() {
  while (mongo.getMongoDBStatus() !== mongo.CONNECTED) {
    console.log(Version + ' ' + mongo.getMongoDBStatusText() + 
              ' [' + mongo.getMongoDBStatus() + ']');
    await sleep(DELAY);    // 1/2 sec tempo
  }
}
*/
