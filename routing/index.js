
// Home page

const express = require('express');
const router = express.Router();
// const fs = require('fs')
// const io = require('socket.io-client');
// const ss = require('socket.io-stream');
//
// const socket = io.connect('http://localhost:9000/');
// const stream = ss.createStream();
// const filename = './video/sample.jpg'
//
// // Client Side createSTREEEEEEEEEEEEAM
//
// ss(socket).emit('profile-image', stream, {name: filename});
// fs.createReadStream(filename).pipe(stream);


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;