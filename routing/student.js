/**
 * Created by Garo on 2019-06-03.
 */

// STUDENT

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;