//----------------------------------------------------------------------------
//    userLogModel.js
//
//    Apr 03 2019   Initial
//----------------------------------------------------------------------------
const Version = 'userLogModel:1.01, Apr 03 2019 ';

const mongoose = require('mongoose');
const logger = require('../utilities/logger');

const schema = mongoose.Schema;

const userLogSchema = new schema(
    {
        userid: schema.ObjectId,
        email: String,
        action: String, // LOGIN, LOGOUT
        timestamp: Date,
    }
);
const userLog = mongoose.model("userLog", userLogSchema);
module.exports = userLog;
