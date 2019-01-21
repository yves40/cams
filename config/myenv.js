//----------------------------------------------------------------------------
//    myenv.js
//
//    Dec 02 2018   Initial
//    Dec 03 2018   Prefix not hard coded
//    Dec 07 2018   Problem with mono node config and CORS
//    Jan 16 2019   Start working on services in the CAMS app
//    Jan 17 2019   Port 8081
//    Jan 21 2019   CORS
//----------------------------------------------------------------------------
const Version = "myenv 1.16, Jan 21 2019 ";

// URL prefix used to call the services node
const prefix = process.env.NODEURLPREFIX || "http://vboxweb:8081";
// For the server.js
const port = "8081";

module.exports.getMode = function getMode() {
  const devmode = process.env.NODEDEVMODE || "true";
  if (devmode.toUpperCase() === "TRUE") {
    return "DEV";
  } else {
    return "PROD";
  }
};
module.exports.getURLprefix = function getURLprefix() {
  if (this.getMode() === "DEV") {
    return prefix;
  } else {
    return "";
  }
};
module.exports.getPrefixSource = function getPrefixSource() {
  if (process.env.NODEURLPREFIX) {
    return "From shell";
  } else {
    return "From javascript";
  }
};
module.exports.getVersion = function getVersion() {
  return Version;
};

module.exports.getPort = function getPort() {
  return port;
};

module.exports.getCORS = function getCORS() {
  return corsOptions;
};

module.exports.getCORSwhitelist = function getCORSwhitelist() {
  return whitelist;
};

//----------------------------------------------------------------------------
// C O R S stuff
//----------------------------------------------------------------------------
const whitelist = [
  'http://vboxweb:8080',
];

function checkOrigin(origin, callback) {
  console.log(Version + (origin === undefined ? 'Local node': origin) + ' CORS check');
  if (origin === undefined) { // Do not want to block REST tools or server-to-server requests
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
  'origin': checkOrigin,
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false,
  'optionsSuccessStatus': 204,
  'credentials': true,
  'allowedHeaders': ['Content-Type', 'Authorization'],
};
