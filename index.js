// load all our environment variables
require("dotenv").config();

const express = require("express");
const app = express();
const cors =  require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const {loginRequired, ensureCorrectUser} = require("./middleware/auth");
const db = require("./models");

const PORT =  process.env.PORT || 8081;


app.use(cors());
app.use(bodyParser.json());



// all routes here 
app.use("/api/auth",authRoutes);
// We apply the middleware we created to make sure the user is logged in and the user is the correct user before being able to create messages
app.use("/api/users/:id/messages",loginRequired, ensureCorrectUser,messagesRoutes);

// route to get all the messages from every single user only if they are logged in
app.get("/api/messages", loginRequired, async function(req, res, next) {
	try {
		let messages = await db.Message.find()
		  .sort({ createdAt: "desc" })
		  .populate("user", {
		    username: true,
		    profileImageUrl: true
		  });
		return res.status(200).json(messages);
	} catch (err) {
		return next(err);
	}
});

// Error handler to handle errors when none of those routes are reached
// next is the third parameter to callback functions (handlers) it allows us to move to the next piece of middleware
app.use(function(req,res,next){
	let err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// This will take in any incoming middleware with an error and it will print out a nicer error display with json
app.use(errorHandler);

app.listen(PORT, function(){
	console.log(`Server is starting on port ${PORT}`);
});