import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/tictactoe";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected Successfully");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    console.log("Server will continue without database Functionality");
  }
};

export default connectDB;
