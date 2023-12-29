const express = require("express");
const router = express.Router();
const multer = require("multer");
const { register, login } = require("../Controllers/auth");

// FILE STORAGE
// SET UP MULTER FOR DISK STORAGE
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
//USER REGISTRATION ROUTE
router.post("/register", upload.single("picture"), register);

//USER LOGIN ROUTE
router.post("/login", login);
module.exports = router;
