const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Database/Models/User");
require("../Cloudinary/cloudinaryConfig");
const uploader = require("../Cloudinary/cloudinaryUploader");

//USER REGISTRATION CONTROLLER
const register = async (req, res) => {
  try {
    const cloudinaryImageUrl = await uploader(req.file); //Cloudinary file uploader function
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Required fields are missing" });
    }
    //Check if user already exists or not
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      //Hashing and salting password before saving
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      //Create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        picturePath: cloudinaryImageUrl,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 1000),
        impressions: Math.floor(Math.random() * 1000),
      });
      //Save new user
      const savedUser = await newUser.save();
      res.status(201).json({ message: "User created successfully", savedUser });
    } else {
      return res.status(409).json({ error: "User already exists" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//LOGIN CONTROLLER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Required fields are missing" });
    }
    const user = await User.findOne({ email });
    //Check user exist or not
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    //Check current password matching with encrypted password in the db
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    //Generate jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    user.tokens.push({ token });
    //Save the updated document with the token added to the db
    await user.save();
    //Send cookie in response
    res.cookie("jwt", token, {
      // expires: new Date(Date.now() + 1800000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    user.password = null;
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
