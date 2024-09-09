import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ApiKeyWithDocType } from "../types/ApiKey";

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const ApiKey = mongoose.model<ApiKeyWithDocType>("ApiKey", apiKeySchema);

export default ApiKey;
