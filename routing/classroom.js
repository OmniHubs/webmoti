
const express = require("express");
const router = express.Router();

const rtcConnect = require('rtc-quickconnect');

rtcConnect('http://switchboard.rtc.io', { room: 'test' })
    .createDataChannel('foo')
    .createDataChannel('bar')
    .on('channel:opened:foo', function(id, dc){
        console.log('Channel foo opened for peer: ' + id);
    });

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

module.exports = router;