var mongoose =  require('mongoose');
var bcrypt =  require('bcryptjs');
mongoose.connect('localhost','loginapp2');
// var db = mongoose.connection;

var UserSchema = mongoose.Schema({
	username:{
		  type:String,
		  index:true
	},
	email:{
		type:String
	},
	password:{
		type:String
	}
});

var User =module.exports= mongoose.model('User' ,UserSchema);

module.exports.createUser =function (newUser,cal) {
	bcrypt.genSalt(10,function(err,salt){
		bcrypt.hash(newUser.password,salt,function(err,hash){
			newUser.password= hash;
			newUser.save(cal);
		})
	})
};
module.exports.getUserByUsername = function(username,callback){
	var qurey =	{username:username};
	User.findOne(qurey,callback);
	console.log("hi getUserByUsername");
}
module.exports.getUserById = function(id,callback){
	User.findOneId(id,callback);

}
module.exports.comparePassword = function(candidatePass,hash,callback){
	bcrypt.compare(candidatePass,hash,function(err,isMatch){
		if(err) throw err;
		callback(null,isMatch);
	})
}