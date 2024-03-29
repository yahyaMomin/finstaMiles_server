import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, require: true },
    userName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true, min: 6 },
    avatar: {
      type: String,
      require: true,
      default:
        "https://firebasestorage.googleapis.com/v0/b/finstamiles-app.appspot.com/o/users%2Fdefault.jpeg?alt=media&token=758cb4cf-acf9-4bdc-a626-b87ad1a1ecd0",
    },
    role: { type: String, default: "user" },
    bio: { type: String, default: "", max: 200 },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    commented: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    profession: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
