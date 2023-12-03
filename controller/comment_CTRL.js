import CommentModel from "../models/commentsModel.js";
import PostModel from "../models/postModel.js";
import RepliesModel from "../models/repliesModel.js";
import userModel from "../models/userModel.js";

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { sortBy } = req.query;

    let sort = {};
    switch (sortBy) {
      case "newest":
        sort = { createdAt: 1 };
        break;
      case "oldest":
        sort = { createdAt: -1 };
        break;
      case "top":
        sort = { likes: -1 };
      default:
        sort = { likes: -1 };
    }

    const comments = await CommentModel.find({ post: postId }).sort(sort).populate("commentedBy");
    res.status(200).json({ status: "success ", comments });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const { userId } = req.header;

    const post = await PostModel.findById(postId);

    if (!post) return res.status(500).json({ status: "error", msg: "post does not exist" });

    const newComment = new CommentModel({
      post: postId,
      comment,
      commentedBy: userId,
    });

    post.comments.push(newComment._id);

    await newComment.save();
    await post.save();

    const comments = await CommentModel.find({ post: post._id }).populate("commentedBy");

    res.status(201).json({
      status: "success",
      msg: "new comment Added",
      comments,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.header;

    const comment = await CommentModel.findById(commentId);
    const post = await PostModel.findById(comment.post);
    if (userId !== comment.commentedBy.toString())
      return res.status(500).json({ status: "error", msg: "not Authorize" });

    post.comments = post.comments.filter((item) => {
      return item.toString() !== commentId;
    });

    await RepliesModel.deleteMany({ comment: commentId });

    await CommentModel.findByIdAndDelete(commentId);

    await post.save();

    res.status(200).json({
      status: "success",
      msg: "comment deleted successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const likeUnlikeComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const { userId } = req.header;
    const comment = await CommentModel.findById(commentId);
    const user = await userModel.findById(userId);

    if (comment.likes.includes(user._id)) {
      comment.likes = comment.likes.filter((item) => item.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }
    await comment.save();

    res.status(200).json({ status: "success", comment });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};
