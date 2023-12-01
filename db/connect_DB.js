import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("server is Running");
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
