//----------------------------------------------------------------------------
//    server.js
//
//    Dec 22 2018    Initial, for the cams project
//----------------------------------------------------------------------------

const Version = "server.js, Dec 22 2018, 1.06 ";

const express = require('express');


const app = express();
app.use(express.static(__dirname + '/dist'));
const router = express.Router();

console.log('----------------- Set some routes -------------------------------');
// Home URL
console.log('/');
router.get('/', function (req, res) {
  res.json({message: 'API initialized'});
})

// For the favicon boring request error
app.use( function(req, res, next) {

  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }
  return next();
});

console.log('----------------- Server status -------------------------------');
const port = process.env.API_PORT || 8080;
app.use('/', router);
app.listen(port, function() {
    console.log(Version);
    console.log(`cams server started on ${port}`);
});
