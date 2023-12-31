const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuthorization = require("../Middlewares/checkAuthorization");
const {
  getFeedPosts,
  getUserPosts,
  likePost,
  createPost,
} = require("../Controllers/posts");

// FILE STORAGE
// SET UP MULTER
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads"); // Set the destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname); // Rename files (if needed)
//   },
// });
// SET UP MULTER FOR MEMORY STORAGE
const storage = multer.memoryStorage();
const upload = multer({ storage });

//CREATE POST
router.post(
  "/create",
  checkAuthorization,
  upload.single("picture"),
  createPost
);

//GET FEED POSTS
router.get("/", checkAuthorization, getFeedPosts);

//GET POSTS OF A SPECIFIC USER
router.get("/:userId", checkAuthorization, getUserPosts);

//MAKE THE CURRENT USER LIKE OR UNLIKE A POST
router.patch("/:id/like", checkAuthorization, likePost);

module.exports = router;
