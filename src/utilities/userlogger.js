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
      this.Version = 'userlogger:1.04, Apr 03 2019 ';
      this.email = email;
      this.userid = objectid(ID);
      this._DB = mongo.getMongoDBConnection();
  };
  //----------------------------------------------------------------------------
  //  action should be 'LOGIN' or 'LOGOUT'
  //  Any other value accepted in case you need to track another user action
  //----------------------------------------------------------------------------
  async log(action) {
    let themessage = new userlog( { 
                                    userid: this.userid,
                                    email: this.email,
                                    action: action, 
                                    timestamp: Date.now(),
                                });
    await themessage.save().then( value => {
        return;
    })
    .catch( value => {
      logger.error(themessage.message + ' : -----------------  Not Saved !!!!!!!!!!!!!');
    }); 
  };
  //----------------------------------------------------------------------------
  getVersion() {
    return this.Version;
  };
};
