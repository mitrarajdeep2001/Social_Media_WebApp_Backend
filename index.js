const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
const connectDB = require("./Database/connect");
const routerAuth = require("./Routes/auth");
const routerUsers = require("./Routes/users");
const routerPosts = require("./Routes/posts");

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Origin", "https://sociobook2023.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cookieParser())
app.use(morgan("common"));
const PORT = process.env.PORT || 3001;

// SET UP SERVER
const main = async () => {
  try {
    await connectDB();
    console.log("Connected to database");
    // ROUTES
    app.use("/auth", routerAuth);
    app.use("/user", routerUsers);
    app.use("/post", routerPosts);
    app.listen(PORT, () => {
      console.log(`Listening to port no ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
main();
