
// STUDENT

// rtc-quickconnect prototype
const quickconnect = require('rtc-quickconnect');
const crel = require('crel');
const capture = require('rtc-capture');
const attach = require('rtc-attach');
const qsa = require('fdom/qsa');
const plugins = [
    require('rtc-plugin-temasys')
];

// create containers for our local and remote video
const local = crel('div', { class: 'local' });
const remote = crel('div', { class: 'remote' });
const peerMedia = {};



const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;