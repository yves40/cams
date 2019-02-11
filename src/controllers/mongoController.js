//----------------------------------------------------------------------------
//    mongoController.js
//
//    Feb 11 2019   Initial
//----------------------------------------------------------------------------

const Version = 'mongoController: 1.01, Feb 11 2019 ';

const auth = require('../auth');
const corsutility = require("../../config/corsutility");
const myenv = require("../../config/myenv");

const passport = require('passport');
const cors = require('cors');

module.exports.controller = (app) => {

    //-----------------------------------------------------------------------------------
    // get mongodb status
    //-----------------------------------------------------------------------------------
    app.get('/mongo/status', cors(corsutility.getCORS()), (req, res) => {
            let mongostatus = myenv.getMongoDBStatus();
            console.log(Version + 'mongostatus = ' + mongostatus);
            res.json( { mongostatus: mongostatus } );
        }
    ); 

    //-----------------------------------------------------------------------------------
    // Version
    //-----------------------------------------------------------------------------------
    module.exports.getVersion =  () => { return Version; }
};
