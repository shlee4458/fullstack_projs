var express = require('express');
var router = express.Router(); // define shorthand for router //

/* GET home page. */
router.get('/', function(req, res, next) { // get add routes to the router //
  res.redirect("/catalog");
});

module.exports = router; // export that router //
