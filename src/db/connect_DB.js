import mongoose from "mongoose";
import { config } from "../config/config.js";

const connectDB = async () => {
   try {
      await mongoose.connect(config.mongoUrl);
      console.log("database connected");
   } catch (error) {
      console.log(error);
   }
};
export default connectDB;
