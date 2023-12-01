import CommentModel from "../models/commentsModel.js";
import RepliesModel from "../models/repliesModel.js";

export const createReply = async (req, res) => {
  try {
    const { commentId, reply } = req.body;
    const { userId } = req.header;

    const comment = await CommentModel.findById(commentId);

    if (!comment) return res.status(404).json({ msg: "comment not exist" });

    const newReply = await new RepliesModel({
      post: comment.post,
      replyBy: userId,
      comment: commentId,
      reply,
    });

    comment.replies.push(newReply._id);

    await newReply.save();
    await comment.save();

    res.status(201).json({
      msg: "replied success !",
      newReply,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const getReplies = async (req, res) => {
  try {
    const { userId } = req.header;
    const { commentId } = req.params;

    const replies = await RepliesModel.find({ comment: commentId }).populate("replyBy");

    res.status(200).json({ status: "success", replies });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    console.log(replyId);
    const { userId } = req.header;

    const reply = await RepliesModel.findById(replyId);
    const comment = await CommentModel.findById(reply.comment);

    comment.replies = comment.replies.filter((item) => {
      return replyId !== item.toString();
    });

    if (reply.replyBy.toHexString() !== userId) return res.status(404).json({ msg: "unAuthorize" });

    await RepliesModel.findByIdAndDelete(replyId);

    await comment.save();

    res.status(200).json({
      status: "success",
      msg: "reply delete successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};
export const likeReply = async (req, res) => {
  try {
    const { replyId } = req.body;
    const { userId } = req.header;

    const reply = await RepliesModel.findById(replyId);

    if (reply.likes.includes(userId)) {
      reply.likes = reply.likes.filter((item) => item._id.toString() !== userId);
    } else {
      reply.likes.push(userId);
    }

    await reply.save();
    res.status(201).json({ status: "success", msg: "liked ! " });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};
