const {MongoClient,ObjectID} = require("mongodb")
const session = require("express-session")
const {getUserName} = require("./../public/functions.js")
const {User} = require("./../model/user.js")
const {Message} = require("./../model/message.js")
const express = require("express")
const path = require("path")
const http = require("http")
var bodyParser = require("body-parser")
const socketIo = require("socket.io")
const {generateMessage} = require("./utils/message.js")

var pathJoin = path.join(__dirname+"/../public")
// console.log(pathJoin);
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(session({
   secret: "MrSdk",
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + 60 * 60 * 24 * 30)

    }))

var server = http.createServer(app)

var io = socketIo(server)

app.get('/login',(request,response)=>{
    response.render('login.hbs')
})

app.post('/login-fill',(request,response)=>{

    body = request.body
    var user = {name:body.name,password:body.password}

    User.findOne(user).then((res)=>{
      // console.log(res);
          if(!res) {  response.render('login.hbs',{error: "User not found"}) }
          else{
            request.session.userId = res._id
            response.redirect('/chat')
          }

          // respons.send(res)

    }).catch((e)=>{ response.send(e) })
})

app.get('/register',(request,response)=>{
  response.render('register.hbs')
})

app.post('/register-fill',(request,response)=>{
    var body = request.body;
    body.role = 3
    var newUser = new User(body)
    newUser.save().then((res)=>{
      request.session.userId = res._id
      response.redirect('/chat')

    })

})

app.get('/chat',async function(request,response){
  if(!request.session.userId){ response.redirect('/login') }
request.session.userId = request.session.userId
  io.on('connection',(socket)=>{
    console.log("New User connect");


    /////////////////////////////
    //  emit()  da uzatiladi
    //  on() da ushlanadi
    ////////////////////////////

    // io.emit('newMessage',generateMessage("Admin","This is new message_2"))

    socket.on('createMessage',(message)=>{
        console.log("Create Message : ",message);

        // io.emit('newMessage',{
        //   from: "sdk@mail.com",
        //   text: "hi "
        // })

        // socket.broadcast.emit('newMessage',generateMessage(message))
    })

    socket.on('disconnect',()=>{
      console.log("User was disconnected");
    })
  });

  userId = request.session.userId
  body = request.body;

  var chat = await Message.find()
  var messages="";

  for(var i=0;i<chat.length;i++){
    var user = await User.findById(chat[i].userId)
    console.log(user);
    var name = user.name
    var time = new Date(chat[i].createdAt)
           messages=messages+`<div style='margin-bottom: -40px;'>
             <h1 style='font-size: 35px; margin-right: -30px;'>${name}: <h3 style='color: white;margin-top: -50px;margin-left: 100px;'>${chat[i].text}<span style='font-size: 15px;margin-left: 30px; color: red'>${time}</span></h3></h1>

             </div><br>`;
  }

    // message = await chat.filter(async (each)=>{
    //   var user = await User.findById(each.userId)
    //   var name = user.name
    //   var time = new Date(each.createdAt)
    //          messages=messages+`<div >
    //            <h1 style='font-size: 35px;'>${name}: <h3 style='color: white;margin-top: -50px;margin-left: 100px;'>${each.text}<span style='font-size: 15px;margin-left: 30px; color: red'>${time}</span></h3></h1>
    //
    //            </div><br>`;
    //            return message;
    //    })
    // var name = "Saydakram"
    // messages = "<div><h1>asd</h1></div>"

    // `<div >
    //   <h1 style='font-size: 35px;'>${name}: <h3 style='color: white;margin-top: -50px;margin-left: 100px;'>ASD<span style='font-size: 15px;margin-left: 30px; color: red'>ASD</span></h3></h1>
    //
    //   </div><br>`

  response.render('chat.hbs',{messages})

})

app.post('/message-save',(request,response)=>{
    if(!request.session.userId){ response.redirect('/login') }
  body = request.body

  var user = {
    text: body.message,
    userId: new ObjectID(request.session.userId),
    createdAt:  new Date().getTime()

  }

  var newMessage = new Message(user)
  newMessage.save().then((res)=>{
    response.redirect('/chat')
  }).catch((e)=>{  response.send(e)})

})



app.use(express.static(pathJoin))

server.listen(8080,(request,response)=>{
    console.log("Server is  on port 8080");
})
