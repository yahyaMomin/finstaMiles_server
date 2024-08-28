import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import mongoose, { Mongoose } from "mongoose";
import uploadFile from "../lib/uploadImage.js";
import { config } from "../config/config.js";

export const getUser = async (req, res, next) => {
   try {
      const { userId } = req.params;
      const user = await userModel.findById(userId).select("-password");
      res.status(200).json({ status: "success", user });
   } catch (error) {
      next(createHttpError(500, error.message));
   }
};

export const updateProfile = async (req, res, next) => {
   try {
      const { userName, fullName, bio } = req.body;
      const { userId } = req;

      const existedUser = await userModel.findById(userId);
      const imageUrl = req.file
         ? uploadFile(req.file, "users")
         : existedUser.profileImage;

      const newUserName = await userName.replace(/ /g, "_");
      const newFullName = await fullName.replace(/\s+/g, " ").trim();
      const newBio = await bio.replace(/\s+/g, " ").trim();

      const isExist = await userModel.findOne({ userName: newUserName });

      if (isExist) {
         if (isExist._id.toString() !== userId)
            return next(createHttpError(400, "username already taken :("));
      }

      const user = await userModel.findByIdAndUpdate(
         userId,
         {
            userName: newUserName,
            fullName: newFullName,
            profileImage: imageUrl,
            bio: newBio,
         },
         { new: true }
      );
      const token = jwt.sign({ id: user._id }, config.secretToken, {
         expiresIn: "30d",
      });

      res.status(200).json({
         status: "success",
         msg: "profile updated !",
         token,
         user,
      });
   } catch (error) {
      res.status(500).json({ status: "err", msg: error.message });
   }
};

export const updatePassword = async (req, res) => {
   try {
      const { oldPassword, newPassword } = req.body;
      const { userId } = req.header;
      const user = await userModel.findById(userId);
      if (userId !== user._id.toString())
         return res.status(500).json({ msg: "unAuthorize" });
      const isMatch = bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
         return res
            .status(500)
            .json({ status: "error", msg: "old password is incorrect" });
      if (oldPassword === newPassword)
         return res.status(500).json({ msg: "both field cant be same" });
      const salt = 12;
      const hash = await bcrypt.hash(newPassword, salt);

      user.password = hash;

      await user.save();

      res.status(201).json({
         status: "success",
         msg: "password updated",
         user,
      });
   } catch (error) {
      res.status(500).json({ status: "error", msg: error.message });
   }
};

export const followUnFollow = async (req, res) => {
   try {
      let { userId } = req;
      let { receiptId } = req.params;
      userId = new mongoose.Types.ObjectId(userId);
      receiptId = new mongoose.Types.ObjectId(receiptId);

      const isFollowing = await userModel.exists({
         _id: userId,
         following: { $in: receiptId },
      });

      if (isFollowing) {
         // If already following, remove from following and followers arrays using $pull
         await userModel.findByIdAndUpdate(userId, {
            $pull: { following: receiptId },
         });

         await userModel.findByIdAndUpdate(receiptId, {
            $pull: { followers: userId },
         });
      } else {
         // If not following, add to following and followers arrays using $push
         await userModel.findByIdAndUpdate(userId, {
            $push: { following: receiptId },
         });

         await userModel.findByIdAndUpdate(receiptId, {
            $push: { followers: userId },
         });
      }
      const user = await userModel.findById(userId).select("-password");

      res.status(200).json({
         status: "success",
         user,
      });
   } catch (error) {
      res.status(500).json({ status: "error", msg: error.message });
   }
};

export const getSearchUsers = async (req, res) => {
   try {
      const { userName } = req.params;

      const users = await userModel.find({
         userName: { $regex: userName, $options: "i" },
      });

      res.status(200).json({ status: "success ", users });
   } catch (error) {
      res.status(500).json({ status: "error", msg: error.message });
   }
};
