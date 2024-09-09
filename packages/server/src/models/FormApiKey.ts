import mongoose, { Schema } from "mongoose";
import { FormApiKeyWithDocType } from "../types/FormApiKey";
import crypto from "crypto";

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      default: () => crypto.randomBytes(64).toString("hex"),
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

const ApiKey = mongoose.model<FormApiKeyWithDocType>("ApiKey", apiKeySchema);

export default ApiKey;
