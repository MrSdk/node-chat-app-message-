
getUserName = async function(id){
    var user = await User.findById(id)
    return user.name
}
module.exports = {getUserName}
