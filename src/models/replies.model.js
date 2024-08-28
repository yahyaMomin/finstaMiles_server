import mongoose from "mongoose";

const repliesSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "comment" },
    replyBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    reply: { type: String, require: true },
  },
  { timestamps: true }
);

const RepliesModel = mongoose.model("replies", repliesSchema);

export default RepliesModel;
