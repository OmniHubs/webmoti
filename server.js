/**
 * Created by Garo on 2019-06-03.
 */


var http = require("http");
var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var cors = require("cors")
const socketIo = require("socket.io");
const socketPort = 4001;
var indexRouter = require('./routing/index')
var usersRouter = require('./routing/student')
var classTesting = require('./routing/classroom')

var app = express();

//Setting up the socketServer
const socketServer = http.createServer(app);
const io = socketIo(socketServer);
socketServer.listen(socketPort, () => console.log(`Listening on port ${socketPort}`));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter)
app.use("/student", usersRouter)
app.use("/classroom", classTesting)

//Setting up the socket connection
io.on("connection", socket => {
    console.log("Connected!");
    try {
        socket.emit("fromSocket", 'HELLOOOO!');
    }catch (error)
    {
        console.error(`Error: ${error.code}`);
    }
});

io.on('connection', function(socket){
    socket.on('stre', function(stream){
        console.log('message: ' + msg);
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;





// const http = require('http')
// const express = require('express')
// const app = express()
//
// const hostname = '127.0.0.1'
// const port = process.env.PORT || 5000;
//
//
// // Log to terminal servers up and running
//
// app.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}`)
// })
//
//
// app.get('/', (req, res) => {
//     res.statusCode = 200
//     res.setHeader('Content-Type','text/plain')
//     res.send('Hi There~')
// })
//
// const server = http.createServer((req, res) => {
// })
//
//
// // Signals instantly terminate (similar to process.exit())
// process.on('SIGTERM', ()=> {app.close(()=>{
//     console.log('Process terminated')
// })})