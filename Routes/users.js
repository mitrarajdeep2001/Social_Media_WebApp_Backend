const express = require("express")
const router = express.Router()
const checkAuthorization = require("../Middlewares/checkAuthorization")
const {getUser, getUserFriends, addRemoveFriend} = require("../Controllers/users")

//GET CURRENT USER
router.get("/:id", checkAuthorization, getUser)

//GET CURRENT USER'S FRIENDS
router.get("/:id/friends", checkAuthorization, getUserFriends)

//ADD OR REMOVE FRIENDS
router.patch("/:id/:friendId", checkAuthorization, addRemoveFriend)

module.exports = router 

//Note: ':id' is the user's id.