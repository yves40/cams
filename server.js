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
//----------------------------------------------------------------------------
const Version = "server.js:Mar 01 2019, 1.58 ";

//----------------------------------------------------------------------------
// Get modules
//----------------------------------------------------------------------------
const myenv = require("./config/mongo");
const myenv = require("./config/myenv");
const corsutility = require("./config/corsutility");
const axiosutility = require("./config/axiosutility");

const express = require("express");
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const passport = require('passport');

console.log('\n\n');

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
console.log('Connect to : ' + myenv.getMongoDBURI());
mongoose.connect(mongo.getMongoDBURI(), 
  { useNewUrlParser: true,
    reconnectTries: 3, 
    reconnectInterval: 1000,
    keepAlive: true,
  })
  .then(
    () => {
      console.log('\nMONGODB :');
      console.log("---------------------------------------------------------");
      console.log('\t\t\tmongodb status : Up');
      console.log();
    }, 
    err => {
      console.log('\nMONGODB :');
      console.log("---------------------------------------------------------");
      console.log('\t\t\tmongodb status : Down');
      console.log(err.message);
      console.log();
    },
  );
//----------------------------------------------------------------------------
// axiosutility test
//----------------------------------------------------------------------------
console.log('\nAXIOS :');
console.log("---------------------------------------------------------");
console.log('\t\t\tUsing axiosutility: ' + axiosutility.getVersion());
//----------------------------------------------------------------------------
// Application controllers
// Find and load deployed controllers : js files in the controllers folder
//----------------------------------------------------------------------------
console.log('\nUtility modules :');
console.log("---------------------------------------------------------");
fs.readdirSync('./src/controllers').forEach( function (file) {
	if( file.substr(-3) === '.js' ) {
    console.log("\t\t\tLoading ./src/controllers/" + file);
    const modul = require('./src/controllers/' + file);
		modul.controller(app);
  }
})
//----------------------------------------------------------------------------
// Cross-Origin Resource Sharing
// https://github.com/expressjs/cors/blob/master/README.md
//----------------------------------------------------------------------------
console.log('\nCORS Security setting, sites list:');
console.log("---------------------------------------------------------");

let loop = 0;
let sitelist = corsutility.getCORSwhitelist();
for (; loop < sitelist.length; ++loop) {
  console.log('\t\t\tSite : ' + sitelist[loop]);
}

app.use(cors(corsutility.getCORS()));

//----------------------------------------------------------------------------
// Check prefix used for services calls, depending on whether using DEV
// or PROD environment
//----------------------------------------------------------------------------
console.log('\nURL prefix mode :');
console.log("---------------------------------------------------------");
console.log('\t\t\t' + myenv.getVersion());
console.log('\t\t\tRun in mode : ' + myenv.getMode());
console.log('\t\t\tURL prefix  : ' + myenv.getURLprefix());
console.log('\t\t\tComing from : ' + myenv.getPrefixSource());

// Home URL
router.get("/", function(req, res) {
  res.json({ message: "API initialized" });
});


//----------------------------------------------------------------------------
// Error handler middleware
//----------------------------------------------------------------------------
app.use(function(error, req, res, next) {
  console.log(error.message);
  res.sendStatus(403); // The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource, or may need an account of some sort.
});
console.log("\nServer status :");
console.log("---------------------------------------------------------");
const port = myenv.getPort();
app.use("/", router);
app.listen(port, function() {
  console.log('\t\t\t' + Version + ': started on ' + port);
});
