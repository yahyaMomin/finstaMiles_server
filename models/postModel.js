import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    description: { type: String, require: true },
    image: { type: String, require: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  },
  { timestamps: true }
);

const PostModel = mongoose.model("post", postSchema);
export default PostModel;
