const Post = require("../Database/Models/Post");
const User = require("../Database/Models/User");
require("../Cloudinary/cloudinaryConfig");
const uploader = require("../Cloudinary/cloudinaryUploader");

//CREATE POST
const createPost = async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body);
    const cloudinaryImageUrl = await uploader(req.file); //Cloudinary file uploader function
    const { userId, description } = req.body;
    if (!userId || !description) {
      return res.status(400).json({ error: "Required fields are missing" });
    }
    const user = await User.findById(userId);
    const newPost = await Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      picturePath: cloudinaryImageUrl,
      userPicturePath: user.picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find();
    console.log(post);
    return res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET FEED POSTS
const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET POSTS OF A SPECIFIC USER
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    if (!post) {
      res.status(400).json({ error: "No post found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//MAKE THE CURRENT USER LIKE OR UNLIKE A POST
const likePost = async (req, res) => {
  try {
    const { id } = req.params; //post id
    const { userId } = req.body; //current user's id
    const post = await Post.findById(id);
    const likedPost = post.likes.get(userId);
    if (likedPost) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPost, getFeedPosts, getUserPosts, likePost };
