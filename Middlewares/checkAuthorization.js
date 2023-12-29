const jwt = require("jsonwebtoken");
const User = require("../Database/Models/User");
require("dotenv").config();

const checkAuthorization = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(verifyToken);
    const validUser = await User.find({ _id: verifyToken._id });
    if (!validUser) {
      return res.status(401).json({ error: "User not authorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkAuthorization;
