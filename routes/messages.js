const express = require('express');
// merge params will allow us to get access to the id inside of the router
const router = express.Router({mergeParams:true});

const { createMessage,getMessage,deleteMessage} = require("../handlers/messages");

// prefix-/api/users/:id/messages
router.route("/").post(createMessage);

router
	.route("/:message_id")
	.get(getMessage)
	.delete(deleteMessage);

module.exports = router;