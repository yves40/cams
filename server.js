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
//    Mar 12 2019    Today, trying to understand middleware ;-)
//    Mar 13 2019    Still trying to understand middleware ;-)
//                   Also trying to clarify importance of middleware and modules 
//                   loading order
//    Mar 14 2019    Play with middleware chaining
//    Mar 17 2019  Logout server error : serializeUser with mail : undefined
//    Mar 24 2019  Test mongologger
//----------------------------------------------------------------------------
const Version = "server.js:Mar 24 2019, 1.90 ";
const LogModule = 'SERVER.JS'

//----------------------------------------------------------------------------
// Get modules
//----------------------------------------------------------------------------
const mongo = require("./src/utilities/mongo");
const myenv = require("./src/utilities/myenv");
const logger = require("./src/utilities/logger");
const mongologger = require("./src/utilities/mongologger");
const jwtconfig = require("./src/utilities/jwtconfig");
const corsutility = require("./src/utilities/corsutility");
const axiosutility = require("./src/utilities/axiosutility");

const express = require("express");
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const passport = require('passport');

console.log('\n\n');

//----------------------------------------------------------------------------
// Some directives for my super logger
//----------------------------------------------------------------------------
logger.enableconsole();
logger.tracetofile();
loggerdata = logger.getLoggerInfo();
logger.info('LOGGER info :');
logger.info("---------------------------------------------------------");
logger.info('Logger console mode : ' + loggerdata.tracetoconsole);
logger.info('Logger file mode    : ' + loggerdata.tracetofile);
logger.info('LOGMODE definition  : ' + loggerdata.logleveldefiner);
logger.info('LOGLEVEL            : ' + loggerdata.loglevel);
logger.info('LOGFILE definition  : ' + loggerdata.logfiledefiner);
logger.info('LOGFILE             : ' + loggerdata.logfile);

//----------------------------------------------------------------------------
// Initialize Express
//----------------------------------------------------------------------------
const app = express();
const router = express.Router();

//----------------------------------------------------------------------------
// Connect to mongo 
//----------------------------------------------------------------------------
logger.info("---------------------------------------------------------");
logger.info('MONGODB :');
logger.info("---------------------------------------------------------");
logger.info('Connect to : ' + mongo.getMongoDBURI());
let _DB = mongo.getMongoDBConnection();

//----------------------------------------------------------------------------
// axiosutility test
//----------------------------------------------------------------------------
logger.info("---------------------------------------------------------");
logger.info('AXIOS :');
logger.info("---------------------------------------------------------");
logger.info('Using axiosutility: ' + axiosutility.getVersion());

//----------------------------------------------------------------------------
// Cross-Origin Resource Sharing
// https://github.com/expressjs/cors/blob/master/README.md
//----------------------------------------------------------------------------
logger.info("---------------------------------------------------------");
logger.info('CORS Security setting, sites list:');
logger.info("---------------------------------------------------------");

let loop = 0;
let sitelist = corsutility.getCORSwhitelist();
for (; loop < sitelist.length; ++loop) {
  logger.info('Site : ' + sitelist[loop]);
}

//----------------------------------------------------------------------------
// Check prefix used for services calls, depending on whether using DEV
// or PROD environment
//----------------------------------------------------------------------------
logger.info("---------------------------------------------------------");
logger.info('URL prefix mode :');
logger.info("---------------------------------------------------------");
logger.info('' + myenv.getVersion());
logger.info('Run in mode : ' + myenv.getMode());
logger.info('URL prefix  : ' + myenv.getURLprefix());
logger.info('Coming from : ' + myenv.getPrefixSource());

//----------------------------------------------------------------------------
// Middleware handlers
// Beware, the order of app.use() calls is VERY important
//----------------------------------------------------------------------------
app.use(bodyParser.json());
app.use(express.static(__dirname + "/dist"));

app.use(function(req, res, next) {  // For the favicon boring request error
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }
  return next();
});
app.use(cors(corsutility.getCORS()));
app.use(passport.initialize()); 
app.use(passport.session());

//----------------------------------------------------------------------------
// Application controllers
// Find and load deployed controllers : js files in the controllers folder
// Do that after the installation of middlewares (just above code)
//----------------------------------------------------------------------------
logger.info("---------------------------------------------------------");
logger.info('Utility modules :');
logger.info("---------------------------------------------------------");
fs.readdirSync('./src/controllers').forEach( function (file) {
	if( file.substr(-3) === '.js' ) {
    logger.info("Loading ./src/controllers/" + file);
    const modul = require('./src/controllers/' + file);
    logger.info("./src/controllers/" + file + ' loaded') ;
		modul.controller(app);
  }
});

//----------------------------------------------------------------------------
// Starts the server
//----------------------------------------------------------------------------
logger.info("---------------------------------------------------------");
logger.info("Server status :");
logger.info("---------------------------------------------------------");
const port = myenv.getPort();
app.use("/", router);
const mylogger = new mongologger(LogModule);
mylogger.informational('Started and listening on port ' + port);
app.listen(port, function() {
  logger.info(Version + ': started on ' + port + '\n\n');
});
