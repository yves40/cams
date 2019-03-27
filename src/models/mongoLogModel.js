//----------------------------------------------------------------------------
//    mongoLogModel.js
//
//    Mar 24 2019   Initial
//    Mar 27 2019   Add fields
//----------------------------------------------------------------------------
const Version = 'mongoLogModel:1.02, Mar 27 2019 ';

const mongoose = require('mongoose');

const logger = require('../utilities/logger');

const schema = mongoose.Schema;

const mongologSchema = new schema(
    {
        module: String,
        message: String,
        timestamp: Date,
        severity: String,   // The classical DIWEF from log4j
    }
);
const Mongolog = mongoose.model("mongolog", mongologSchema);
module.exports = Mongolog;
