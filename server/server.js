const express = require("express")
const path = require("path")
const http = require("http")
const socketIo = require("socket.io")

var pathJoin = path.join(__dirname+"/../public")
// console.log(pathJoin);
var app = express()
var server = http.createServer(app)

var io = socketIo(server)

io.on('connection',(socket)=>{
  console.log("New User connect");

  socket.emit('newMessage',{
    from: "sdk@mail.com",
    text: "hi "
  })

  /////////////////////////////
  //  emit()  da uzatiladi
  //  on() da ushlanadi
  ////////////////////////////

  socket.on('createMessage',(message)=>{
      console.log("Create Message : ",message);
  })


  socket.on('disconnect',()=>{
    console.log("User was disconnected");
  })
})

app.use(express.static(pathJoin))

server.listen(8080,(request,response)=>{
    console.log("Server is up on port 8080");
})
