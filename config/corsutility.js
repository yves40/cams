//----------------------------------------------------------------------------
//    corsutility.js
//
//    Feb 01 2019   Initial, from myenv.js
//----------------------------------------------------------------------------
const Version = "corsutility 1.12, Feb 01 2019 ";

const whitelist = [
  'http://vboxweb:8080',
];

function checkOrigin(origin, callback) {
  // console.log(Version + (origin === undefined ? 'Local node': origin) + ' CORS check');
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

module.exports.getCORS = function getCORS() {
  return corsOptions;
};

module.exports.getCORSwhitelist = function getCORSwhitelist() {
  return whitelist;
};

