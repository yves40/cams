//----------------------------------------------------------------------------
//    server.js
//
//    Dec 22 2018    Initial, for the cams project
//    Jan 16 2019    use config/myenv
//----------------------------------------------------------------------------
var myenv = require("./config/myenv");

const Version = "server.js, Jan 16 2019, 1.11 ";

const express = require("express");

const app = express();
app.use(express.static(__dirname + "/dist"));
const router = express.Router();

console.log(
  "----------------- Set some routes -------------------------------"
);
// Home URL
console.log("/");
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

console.log("----- Server status: ${Version} -------");
const port = myenv.getPort();
app.use("/", router);
app.listen(port, function() {
  console.log(Version);
  console.log(`cams server started on ${port}`);
});
