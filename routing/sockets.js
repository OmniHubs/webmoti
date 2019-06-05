// let interval
//
// //
//
// io.on("connection", socket =>  {
//     console.log("New client connected")
//     if(interval){
//         clearInterval(interval)
//     }
//     interval = setInterval(() => getApiAndEmit(socket), 10000)
//     socket.on("disconnect", () => {
//         console.log("Client disconnected")
//     })
// }