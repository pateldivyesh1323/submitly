import mongoose from "mongoose";
import environments from "../environments";

const connectDB = async () => {
  try {
    await mongoose.connect(environments.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
