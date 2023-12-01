import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;
    const newUserName = await userName.toLowerCase().replace(/ /g, "_");
    const isUser = await userModel.findOne({ userName: newUserName });
    const isEmail = await userModel.findOne({ email });

    if (isUser)
      return res.status(404).json({
        status: "error",
        msg: "username already exist",
      });
    if (isEmail) return res.status(404).json({ status: "error", msg: "email already exist" });

    const salt = await bcrypt.genSalt(12);

    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullName,
      userName: newUserName,
      email,
      password: hashPass,
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (err) {
    res.status(404).json({ status: "error", msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).populate("posts");

    if (!user) return res.status(400).json({ msg: "user does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "incorrect password" });

    const accessToken = await createAccessToken({ id: user._id });
    const refreshToken = await createRefreshToken({ id: user._id });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      status: "success",
      accessToken,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", msg: err.message });
  }
};

export const generateAccessToken = async (req, res) => {
  try {
    const ref_token = req.cookies.refreshToken;

    if (!ref_token) return res.status(400).json({ msg: "please login now. " });

    jwt.verify(ref_token, process.env.REFRESH_SECRET_TOKEN, async (err, result) => {
      if (err) return res.status(400).json({ msg: "please login now." });

      const user = userModel.findById(result.id).select("-password");

      if (!user) return res.status(400).json({ msg: "user not exist" });

      const accessToken = createAccessToken({ id: user._id });

      res.json({
        accessToken,
        user,
      });
    });
  } catch (err) {
    res.status(404).json({ error: err.massage });
  }
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "30d" });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET_TOKEN, { expiresIn: "30d" });
};
