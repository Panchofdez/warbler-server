const mongoose = require('mongoose');
// DATABASE SET-UP
mongoose.set("debug",true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI|| "mongodb://localhost/warbler",{
	keepAlive:true
});



module.exports.User = require("./user");
module.exports.Message = require("./message");
