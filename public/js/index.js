var socket = io()

socket.on('connect',()=>{
  console.log("User is connecting");
})

socket.on('disconnect',()=>{
  console.log("Disconnect from server");
})

/////////////////////////////
//  emit()  da uzatiladi
//  on() da ushlanadi
////////////////////////////

// socket.on('newMessage',(message)=>{
//   console.log(message);
// })


socket.emit('createMessage',{
    from: "Admin",
    text: "This is new message"
})
