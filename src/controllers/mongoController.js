//----------------------------------------------------------------------------
//    mongoController.js
//
//    Feb 11 2019   Initial
//    Feb 21 2019   WIP on mongodb status check
//    Mar 05 2019   Mongo status used to manage menu items 
//                  CORS not used to check mongo status
//----------------------------------------------------------------------------

const Version = 'mongoController: 1.12, Mar 05 2019 ';

const corsutility = require("../../config/corsutility");
const mongo = require("../utilities/mongo");

const passport = require('passport');
const cors = require('cors');

module.exports.controller = (app) => {

    //-----------------------------------------------------------------------------------
    // get mongodb status
    //-----------------------------------------------------------------------------------
    app.get('/mongo/status', cors(corsutility.getCORS()), (req, res) => {
            let mongostatus = mongo.getMongoDBStatus();
            let mongodown = mongo.IsMongoDown();
            console.log(Version + 'mongodown = ' + mongodown);
            res.json( { mongostatus: mongostatus, mongodown: mongodown } );
        }
    ); 

    //-----------------------------------------------------------------------------------
    // Version
    //-----------------------------------------------------------------------------------
    module.exports.getVersion =  () => { return Version; }
};
