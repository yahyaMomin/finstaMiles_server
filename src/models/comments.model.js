import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    comment: { type: String, require: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "replies" }],
  },
  { timestamps: true }
);
const CommentModel = mongoose.model("comment", commentSchema);

export default CommentModel;
