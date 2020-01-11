const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	email: {
		type:String,
		required:true,
		unique: true
	},
	username: {
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},
	profileImageUrl:{
		type:String
	},
	messages:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:" Message"
		}
	]
});

// Here we make password comparison function
//  before we save a user to the database we want to modify that password by hashing it
// to do this we create a middleware function to the userSchema model to add a prehook before saving
userSchema.pre("save", async function(next){
	try{
		// if the password hasnt been changed we dont need to hash it again 
		if(!this.isModified("password")){
			return next();
		}
		// here we use bcrypt to hash the password 
		let hashedPassword = await bcrypt.hash(this.password,10);
		this.password = hashedPassword;
		return next(); 
	}catch(err){
		return next(err);
	}
});

// We are adding an instance method to every docuement created from the userSchema model
userSchema.methods.comparePassword = async function(candidatePassword, next){
	try{
		// we wait for bcrypt compare to check if password is correct and returns a boolean
		let isMatch = await bcrypt.compare(candidatePassword,this.password);
		return isMatch;
	}catch(err){
		return next(err);
	}
};


const User = mongoose.model("User", userSchema);

module.exports = User;