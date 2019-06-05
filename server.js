
const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const cors = require("cors")
const http = require('http');
const fs = require('fs')


const indexRouter = require('./routing/index')
const usersRouter = require('./routing/student')
const classTesting = require('./routing/classroom')
const anotherTest = require('./routing/anotherTest')

const app = express()

const socketIo = require("socket.io");
const ss = require('socket.io-stream');
const socketPort = 4001;

const myServer = http.createServer(app)
const io = socketIo(myServer);
myServer.listen(socketPort, () => console.log(`listening on port ${socketPort}`))

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
app.use("anotherTest", anotherTest)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})



io.on("connection", socket =>  {
    console.log("New client connected")
    try{
        socket.emit('FromAPI', "Hi THERE BUDDY ITS WORKING")
    }catch (error){
        throw(error)
    }
    // socket.on("disconnect", () => {
    //     console.log("Client disconnected")
    // })
})

// ServerSide STREAMMMMMMMMMMMMm

io.of('/').on('connection', function(socket){
    ss(socket).on('profile-image', function(stream, data){
        const path = require('./video/video.mp4')
        const filename = path.basename(data.name)
        console.log(filename);
        stream.pipe(fs.0(filename))
    })
})


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