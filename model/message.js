const {mongoose} = require("./../db/db.js")

var Message = mongoose.model('chat',{
    text:{
      type:String,
      required: true
    },
    userId:{
      type:String,
      required: true
    },
    createdAt:{
      type:Number
    }
})

module.exports = {Message}
