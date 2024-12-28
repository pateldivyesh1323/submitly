import mongoose, { Schema } from "mongoose";
import { FormApiKeyWithDocType } from "../types/FormApiKey";
import crypto from "crypto";

const formApiKeySchema = new Schema(
  {
    key: {
      type: String,
      default: () => crypto.randomBytes(32).toString("hex"),
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

const FormApiKey = mongoose.model<FormApiKeyWithDocType>(
  "FormApiKey",
  formApiKeySchema,
);

export default FormApiKey;
