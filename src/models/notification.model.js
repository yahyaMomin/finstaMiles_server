import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
   to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
   },
   from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
   },
   read: {
      type: Boolean,
      default: "false",
   },
});
