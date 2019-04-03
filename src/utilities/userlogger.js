//----------------------------------------------------------------------------
//    userlogger.js
//
//    Mar 24 2019   Initial
//    Mar 25 2019   WIP on methods
//    Mar 27 2019    Playing with async & Promise...
//----------------------------------------------------------------------------
"use strict"

const objectid = require('mongodb').ObjectId;

const userlog = require ('../models/userLogModel');
const mongo = require ('../utilities/mongo');
const logger = require ('../utilities/logger');

//----------------------------------------------------------------------------
// The class 
//----------------------------------------------------------------------------
module.exports = class userlogger {
  constructor (email, ID = 0) {
      this.Version = 'userlogger:1.06, Apr 03 2019 ';
      this.DEBUG = 0;
      this.INFORMATIONAL = 1;
      this.WARNING = 2;
      this.ERROR = 3;
      this.FATAL = 4;
      this.email = email;
      this.userid = objectid(ID);
      this._DB = mongo.getMongoDBConnection();
  };
  //----------------------------------------------------------------------------
  //  action should be 'LOGIN' or 'LOGOUT'
  //  Any other value accepted in case you need to track another user action
  //----------------------------------------------------------------------------
  async log(action, severity = this.DEBUG) {
    let themessage = new userlog( { 
                                    userid: this.userid,
                                    email: this.email,
                                    action: action, 
                                    timestamp: Date.now(),
                                    severity: severity,
                                });
    await themessage.save().then( value => {
        return;
    })
    .catch( value => {
      logger.error(themessage.message + ' : -----------------  Not Saved !!!!!!!!!!!!!');
    }); 
  };
  //----------------------------------------------------------------------------
  debug(message) {this.log(message, this.DEBUG);};
  informational(message) {this.log(message, this.INFORMATIONAL);};
  warning(message) {this.log(message, this.WARNING);};
  fatal(message) {this.log(message, this.FATAL);};
  error(message) {this.log(message, this.ERROR);};
  //----------------------------------------------------------------------------
  getVersion() {
    return this.Version;
  };
};
