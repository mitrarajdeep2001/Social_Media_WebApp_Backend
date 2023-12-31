const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
const path = require("path");
const connectDB = require("./Database/connect");
const routerAuth = require("./Routes/auth");
const routerUsers = require("./Routes/users");
const routerPosts = require("./Routes/posts");

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cookieParser())
app.use(morgan("common"));
// app.use("/assets", express.static(path.join("./uploads")));
const PORT = process.env.PORT || 3001;
// const {users, posts} = require("./Data/index");
// const User = require("./Database/Models/User");
// const Post = require("./Database/Models/Post");

// SET UP SERVER
const main = async () => {
  try {
    await connectDB();
    console.log("Connected to database");
    // ROUTES
    app.use("/auth", routerAuth);
    app.use("/user", routerUsers);
    app.use("/post", routerPosts);
    // User.insertMany(users)
    // Post.insertMany(posts)
    app.listen(PORT, () => {
      console.log(`Listening to port no ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
main();
