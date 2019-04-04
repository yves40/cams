//----------------------------------------------------------------------------
//    templateModel.js
//
//    Apr 03 2019   Initial
//----------------------------------------------------------------------------
const Version = 'templateModel:1.00, Apr 03 2019 ';

const mongoose = require('mongoose');
const logger = require('../utilities/logger');

const schema = mongoose.Schema;

const templateSchema = new schema(
    {
        module: String,
        message: String,
        timestamp: Date,
        severity: String,   // The classical DIWEF from log4j
    }
);
const template = mongoose.model("template", templateSchema);
module.exports = template;
