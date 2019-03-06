//----------------------------------------------------------------------------
//    server.js
//
//    Dec 22 2018    Initial, for the cams project
//    Jan 16 2019    use config/myenv
//    Jan 17 2019    Setup login and register services
//    Jan 19 2019    CORS problem is back ;-(
//    Jan 20 2019    CORS ;-(
//    Jan 21 2019    CORS ! Found the problem. Seeking for the best solution
//                   Then some work on passport
//    Feb 01 2019    CORS moved to a separate file
//    Feb 05 2019    Remove exprsession, used a month ago when learning JWT
//    Feb 06 2019    Mongodb reorg
//    Feb 08 2019    Test axiosutility
//    Feb 09 2019    Error handler ????
//    Feb 10 2019    Change the way mongodb connection is handled
//    Feb 11 2019    WIP on mongodb status checking
//    Feb 20 2019    WIP on mongodb status checking, phase 2
//    Mar 01 2019    mongo utilities in a specific file
//    Mar 05 2019    Fix some errors and move utilities code
//                   Some work on a logger
//    Mar 06 2019    console.log replaced by logger
//----------------------------------------------------------------------------
const Version = "server.js:Mar 06 2019, 1.68 ";

//----------------------------------------------------------------------------
// Get modules
//----------------------------------------------------------------------------
const mongo = require("./src/utilities/mongo");
const myenv = require("./src/utilities/myenv");
const logger = require("./src/utilities/logger");
const corsutility = require("./src/utilities/corsutility");
const axiosutility = require("./src/utilities/axiosutility");

const express = require("express");
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const passport = require('passport');

console.log('\n\n');

// Some directives for my super logger
logger.enableconsole();
logger.tracetofile('/tmp/nodeserver.log');

//----------------------------------------------------------------------------
// Initialize Express
//----------------------------------------------------------------------------
const app = express();
const router = express.Router();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/dist"));
//----------------------------------------------------------------------------
//  Session management : Use Passport
//  Beware, the order of app.use() calls is mandatory
//----------------------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());
//----------------------------------------------------------------------------
// For the favicon boring request error
//----------------------------------------------------------------------------
app.use(function(req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }
  return next();
});
//----------------------------------------------------------------------------
// Connect to mongo 
//----------------------------------------------------------------------------
logger.info('Connect to : ' + mongo.getMongoDBURI());
let _DB = mongo.getMongoDBConnection();
//----------------------------------------------------------------------------
// axiosutility test
//----------------------------------------------------------------------------
logger.info('AXIOS :');
logger.info("---------------------------------------------------------");
logger.info('\tUsing axiosutility: ' + axiosutility.getVersion());
//----------------------------------------------------------------------------
// Application controllers
// Find and load deployed controllers : js files in the controllers folder
//----------------------------------------------------------------------------
logger.info('Utility modules :');
logger.info("---------------------------------------------------------");
fs.readdirSync('./src/controllers').forEach( function (file) {
	if( file.substr(-3) === '.js' ) {
    logger.info("\tLoading ./src/controllers/" + file);
    const modul = require('./src/controllers/' + file);
		modul.controller(app);
  }
})
//----------------------------------------------------------------------------
// Cross-Origin Resource Sharing
// https://github.com/expressjs/cors/blob/master/README.md
//----------------------------------------------------------------------------
logger.info('CORS Security setting, sites list:');
logger.info("---------------------------------------------------------");

let loop = 0;
let sitelist = corsutility.getCORSwhitelist();
for (; loop < sitelist.length; ++loop) {
  logger.info('\tSite : ' + sitelist[loop]);
}

app.use(cors(corsutility.getCORS()));

//----------------------------------------------------------------------------
// Check prefix used for services calls, depending on whether using DEV
// or PROD environment
//----------------------------------------------------------------------------
logger.info('URL prefix mode :');
logger.info("---------------------------------------------------------");
logger.info('\t' + myenv.getVersion());
logger.info('\tRun in mode : ' + myenv.getMode());
logger.info('\tURL prefix  : ' + myenv.getURLprefix());
logger.info('\tComing from : ' + myenv.getPrefixSource());

// Home URL
router.get("/", function(req, res) {
  res.json({ message: "API initialized" });
});


//----------------------------------------------------------------------------
// Error handler middleware
//----------------------------------------------------------------------------
app.use(function(error, req, res, next) {
  logger.error(error.message);
  res.sendStatus(403); // The request was valid, but the server is rejecting action. The user might not have the necessary permissions for a resource, or may need an account of some sort.
});
logger.info("Server status :");
logger.info("---------------------------------------------------------");
const port = myenv.getPort();
app.use("/", router);
app.listen(port, function() {
  logger.info('\t' + Version + ': started on ' + port + '\n\n');
});
