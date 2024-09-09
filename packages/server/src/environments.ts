import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/submitly",
  ORIGIN_URI: process.env.ORIGIN_URI || "http://localhost:5173",
};
