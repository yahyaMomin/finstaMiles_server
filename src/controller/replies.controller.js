import createHttpError from "http-errors";
import CommentModel from "../models/comments.model.js";
import RepliesModel from "../models/replies.model.js";

export const createReply = async (req, res, next) => {
   try {
      const { reply } = req.body;
      const { commentId } = req.params;
      const { userId } = req;

      const comment = await CommentModel.findById(commentId);

      if (!comment) return next(createHttpError(400, "comment do not exist"));

      const newReply = new RepliesModel({
         post: comment.post,
         replyBy: userId,
         comment: commentId,
         reply,
      });

      comment.replies.push(newReply._id);

      await newReply.save();
      await comment.save();

      res.status(201).json({
         status: "success",
         msg: "replied success !",
         newReply,
      });
   } catch (error) {
      return next(createHttpError(500, error.message));
   }
};

export const getReplies = async (req, res, next) => {
   try {
      const { commentId } = req.params;

      const replies = await RepliesModel.find({ comment: commentId }).populate(
         "replyBy"
      );

      res.status(200).json({ status: "success", replies });
   } catch (error) {
      return next(createHttpError(500, error.message));
   }
};

export const deleteReply = async (req, res, next) => {
   try {
      const { replyId } = req.params;
      const { userId } = req;

      const reply = await RepliesModel.findById(replyId);
      const comment = await CommentModel.findById(reply.comment);

      comment.replies = comment.replies.filter((item) => {
         return replyId !== item.toString();
      });

      if (reply.replyBy.toHexString() !== userId)
         return next(createHttpError(400, "not authorize"));

      await RepliesModel.findByIdAndDelete(replyId);

      await comment.save();

      res.status(200).json({
         status: "success",
         msg: "reply delete successfully",
         comment,
      });
   } catch (error) {
      return next(createHttpError(500, error.message));
   }
};
export const likeReply = async (req, res, next) => {
   try {
      const { replyId } = req.params;
      const { userId } = req;

      const reply = await RepliesModel.findById(replyId);

      if (reply.likes.includes(userId)) {
         reply.likes = reply.likes.filter(
            (item) => item._id.toString() !== userId
         );
      } else {
         reply.likes.push(userId);
      }

      await reply.save();
      res.status(201).json({ status: "success", msg: "liked ! " });
   } catch (error) {
      return next(createHttpError(500, error.message));
   }
};
