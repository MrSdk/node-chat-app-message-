const {mongoose} = require("./../db/db")
var User = mongoose.model('User',{
  name:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  role:{
    type: Number
  }
})

module.exports = {User}
