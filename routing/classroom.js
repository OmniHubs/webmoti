/**
 * Created by Garo on 2019-06-03.
 */

var express = require("express");
var router = express.Router();
const peerJs = require('peerjs-nodejs');
const peer = peerJs({ key: 'abcxyz' });

let conn = peer.connect('foo');
conn.serialization = 'json';
conn.send({ value: 'hello' });

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

module.exports = router;