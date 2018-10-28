const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
var app = express();
const http = require("http")
const request = require("request")

var server = http.createServer(app)
app.use(session({ secret: 'keyboard cat' }))

app.use(bodyParser.json())

app.get('/',(request,response)=>{

  request.session.name = "sdk"

  var a = request.session.name;

  response.send("Session is "+a)

})


app.get('/session',(request,response)=>{

  var b;
    try {
            b = request.session.name
    } catch (e) {

            b="Session don't exist"
    }
  response.send("Session: "+b)

})

app.get('/destroy',(req,res)=>{
  req.session.destroy(()=>{
      res.redirect('/session')
  })

  // request('/',(err,res,body)=>{})
})


server.listen(8080,()=>{
  console.log("Server on port 8080");
})
