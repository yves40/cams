//----------------------------------------------------------------------------
//    mongoLogModel.js
//
//    Mar 24 2019   Initial
//----------------------------------------------------------------------------
const Version = 'mongoLogModel:1.01, Mar 24 2019 ';

const objectid = require('mongodb').ObjectId;
const mongoose = require('mongoose');

const logger = require('../utilities/logger');

const schema = mongoose.Schema;

const mongologSchema = new schema(
    {
        type: String,
        message: String,
        timestamp: Date,
    }
);
const Mongolog = mongoose.model("mongolog", mongologSchema);
module.exports = Mongolog;
