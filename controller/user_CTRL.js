import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).select("-password");

    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let { userName, fullName, bio, instagram, twitter, linkedin, profession, location, url } = req.body;
    const { userId } = req.header;

    const existedUser = await userModel.findById(userId);

    const avatar = url ? url : existedUser.avatar;

    const newUserName = await userName.replace(/ /g, "_").toLowerCase();
    const newFullName = await fullName.replace(/\s+/g, " ").trim();
    const newBio = await bio.replace(/\s+/g, " ").trim();

    const isExist = await userModel.findOne({ userName: newUserName });

    if (isExist) {
      if (isExist._id.toString() !== userId)
        return res.status(500).json({ status: "error", msg: "userName is already exist !" });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        userName: newUserName,
        fullName: newFullName,
        avatar,
        bio: newBio,
        instagram: instagram === "" ? "" : instagram,
        twitter: twitter === "" ? "" : twitter,
        linkedin: linkedin === "" ? "" : linkedin,
        profession: profession === "" ? "" : profession,
        location: location === "" ? "" : location,
      },
      { new: true }
    );
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "30d" });

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
    if (userId !== user._id.toString()) return res.status(500).json({ msg: "unAuthorize" });
    const isMatch = bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(500).json({ status: "error", msg: "old password is incorrect" });
    if (oldPassword === newPassword) return res.status(500).json({ msg: "both field cant be same" });
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
    const { userId } = req.header;
    const { followingId } = req.params;

    const user = await userModel.findById(userId).select("-password");
    const followingUser = await userModel.findById(followingId);

    if (user.following.includes(followingUser._id)) {
      user.following = user.following.filter((item) => item.toString() !== followingUser._id.toString());
      followingUser.followers = followingUser.followers.filter((item) => item.toString() !== user._id.toString());
    } else {
      user.following.push(followingUser._id);
      followingUser.followers.push(user._id);
    }

    await user.save();
    await followingUser.save();

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

    const users = await userModel.find({ userName: { $regex: userName, $options: "i" } });

    res.status(200).json({ status: "success ", users });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};
