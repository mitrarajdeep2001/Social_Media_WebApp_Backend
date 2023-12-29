const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = () => {
  const username = encodeURIComponent(process.env.MONGODB_USERNAME);
  const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
  const uri = `mongodb+srv://${username}:${password}@cluster2.efjhf1q.mongodb.net/social_media_app?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};

module.exports = connectDB;
