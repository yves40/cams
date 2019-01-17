//----------------------------------------------------------------------------
//    server.js
//
//    Dec 22 2018    Initial, for the cams project
//    Jan 16 2019    use config/myenv
//    Jan 17 2019    Setup login and register services
//----------------------------------------------------------------------------
const Version = "server.js, Jan 17 2019, 1.22 ";

//----------------------------------------------------------------------------
// Get modules
//----------------------------------------------------------------------------
const express = require("express");
const jwtconfig = require("./config/jwtconfig");  
const myenv = require("./config/myenv");
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser  = require('body-parser');
const cors = require('cors');

console.log('\n\n' +Version + '\n\n');

//----------------------------------------------------------------------------
// Initialize Express
//----------------------------------------------------------------------------
const app = express();
app.use(express.static(__dirname + "/dist"));
const router = express.Router();
app.use(bodyParser.json());

//----------------------------------------------------------------------------
// Connect to mongo 
//----------------------------------------------------------------------------
mongoose.connect(jwtconfig.mongodb, 
  { useNewUrlParser: true },
  function() {
    console.log('\nMONGODB connection :');
    console.log("---------------------------------------------------------");
    console.log("\t\t\tmongoose connected on DB movie");
  } )
  .catch(
    err => {
      console.error('\t\t\tProblem during mongo connection on DB movie');
      console.log(err.stack);
      process.exit(1);
    }
  );

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
// Cross-origin Resource Sharing
// https://github.com/expressjs/cors/blob/master/README.md
//----------------------------------------------------------------------------
console.log('\nCORS Security setting, sites list:');
console.log("---------------------------------------------------------");

var whitelist = [
    'http://192.168.47.200:8080', 
    'http://vboxweb:8080',
    'http://vboxweb:8081',
  ];

let i = 0;
for (; i < whitelist.length; ++i) {
  console.log('\t\t\t' + whitelist[i])
}

function checkOrigin(origin, callback) {
  console.log(Version + (origin === undefined ? 'Local node': origin) + ' CORS check');
  if (origin === undefined) { // For single node config
    callback(null, true);
  }
  else { // origin is specified
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log(Version + (origin === null ? 'Local node': origin) + ' not allowed by CORS');
      callback(new Error('Not allowed by CORS'));
    }
  }
}
const corsOptions = {
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false,
  'optionsSuccessStatus': 204,
  'credentials': true,
  'allowedHeaders': ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

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

// For the favicon boring request error
app.use(function(req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }
  return next();
});

console.log("\nServer status :");
console.log("---------------------------------------------------------");
const port = myenv.getPort();
app.use("/", router);
app.listen(port, function() {
  console.log(`\t\t\tcams server started on ${port}`);
});
