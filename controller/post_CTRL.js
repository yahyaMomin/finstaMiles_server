import mongoose from "mongoose";
import CommentModel from "../models/commentsModel.js";
import postModel from "../models/postModel.js";
import RepliesModel from "../models/repliesModel.js";
import userModel from "../models/userModel.js";

export const createPost = async (req, res) => {
  try {
    let { description, url } = req.body;
    const { userId } = req.header;
    console.log(description, url);

    const date = new Date();

    if (description.length <= 1) description = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    const user = await userModel.findById(userId).select("-password");

    if (!user) return res.status(500).json({ status: "error", msg: "user not exist" });

    const newPost = new postModel({
      postedBy: userId,
      description,
      image: url,
    });

    user.posts.push(newPost._id);
    await newPost.save();
    await user.save();

    res.status(201).json({
      status: "success",
      msg: "new Post Created",
      user,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId, description } = req.body;
    const { userId } = req.header;

    const post = await postModel.findById(postId);
    const author = post.postedBy.toString();

    if (author !== userId) return res.status(500).json({ status: "error", msg: "unAuthorize" });
    post.description = description;
    const updatedPost = await post.save();

    res.status(201).json({
      status: "success",
      msg: "post updated!",
      updatedPost,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.header;

    const post = await postModel.findById(postId);
    const user = await userModel.findById(userId).select("-password");
    if (userId !== post.postedBy.toString()) return res.status(500).json({ msg: "unAuthorize" });

    await CommentModel.deleteMany({ post: postId });

    user.posts = user.posts.filter((item) => {
      const string = item.toString();
      return string !== postId;
    });

    await RepliesModel.deleteMany({ post: postId });

    await postModel.deleteOne({ _id: postId });
    await user.save();

    res.status(200).json({
      status: "success",
      msg: "deleted success!",
      user,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const getRandomUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const users = await userModel.aggregate([
      { $match: { _id: { $ne: userObjectId, $nin: user.following.map((id) => id._id) } } },
      { $sample: { size: 10 } },
      { $project: { password: 0 } },
    ]);

    res.status(200).json({
      status: "success",
      "total result": user.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const page = req.query.pageNum ?? 1;
    const limit = 50;
    const posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("postedBy");

    res.status(200).json({ status: "success", posts });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const sort = req.query.sort ?? -1;
    const limit = req.query.limit ?? 20;
    const page = req.query.page ?? 1;

    const posts = await postModel
      .find({ postedBy: userId })
      .sort({ createdAt: sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("postedBy");

    res.status(200).json({ status: "success", posts });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { userId } = req.header;

    const post = await postModel.findById(postId);
    const user = await userModel.findById(userId);

    if (post.likes.includes(user._id)) {
      post.likes = post.likes.filter((item) => item.toString() !== userId);
      user.liked = user.liked.filter((item) => item.toString() !== postId);
    } else {
      post.likes.push(userId);
      user.liked.push(postId);
    }

    await user.save();
    await post.save();

    res.status(200).json({
      status: "success",
      msg: "new like added!",
      post,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const updateDescription = async (req, res) => {
  try {
    const { postId, description } = req.body;

    const post = await postModel.findByIdAndUpdate({ _id: postId }, { description: description }, { new: true });

    res.status(200).json({
      status: "success",
      msg: "post Updated",
      post,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};
