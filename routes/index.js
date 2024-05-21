var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/status', function(req, res, next) {
  res.status(200).json({ok: true})
});

module.exports = router;
