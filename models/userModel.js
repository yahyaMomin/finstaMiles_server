import mongoose, { Mongoose, Types } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, require: true },
    userName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true, min: 6 },
    avatar: { type: String, require: true, default: "main.jpg" },
    role: { type: String, default: "user" },
    bio: { type: String, default: "", max: 200 },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    commented: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    instagram: String,
    twitter: String,
    linkedin: String,
    profession: String,
    location: String,
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
