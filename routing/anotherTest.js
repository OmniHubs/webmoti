const express = require("express")
const router = express.Router();
const path = require('path');

const app = express();
const http = require('http').createServer(app);
var io = require('socket.io')(http);

router.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname + '/index.html'))
});

io.on('connection', function(socket){
    console.log('a user has connected')
})

module.exports = router;