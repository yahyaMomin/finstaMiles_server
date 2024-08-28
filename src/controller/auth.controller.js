import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import createHttpError from "http-errors";
import { config } from "../config/config.js";

export const register = async (req, res, next) => {
   try {
      const { fullName, userName, email, password } = req.body;
      const newUserName = await userName.replace(/ /g, "_");
      const isUser = await userModel.findOne({ userName: newUserName });
      const isEmail = await userModel.findOne({ email });

      if (isUser) return next(createHttpError(400, "user already exist"));
      if (isEmail) return next(createHttpError(400, "email  already exist"));

      const salt = await bcrypt.genSalt(10);

      const hashPass = await bcrypt.hash(password, salt);

      const newUser = new userModel({
         fullName,
         userName: newUserName,
         email,
         password: hashPass,
      });

      const token = createAccessToken({ sub: newUser._id });

      await newUser.save();

      res.status(201).json({
         status: "success",
         user: {
            ...newUser._doc,
            password: "",
         },
         token,
      });
   } catch (err) {
      return next(createHttpError(500, err.message));
   }
};

export const login = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) return next(createHttpError(400, "user does not exist"));
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return next(createHttpError(400, "incorrect password"));
      const token = createAccessToken({ sub: user._id });
      user.populate("posts");

      res.status(200).json({
         status: "success",
         token,
         user: {
            ...user._doc,
            password: "",
         },
      });
   } catch (err) {
      return next(createHttpError(500, err));
   }
};

const createAccessToken = (payload) => {
   return jwt.sign(payload, config.secretToken, {
      expiresIn: "1d",
   });
};
const createRefreshToken = (payload) => {
   return jwt.sign(payload, config.secretToken, {
      expiresIn: "30d",
   });
};
