import mongoose from "mongoose";
import crypto from "crypto";
import { FormWithDocType } from "../types/Form";

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    formId: {
      type: String,
      default: () => crypto.randomBytes(8).toString("hex"),
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Form = mongoose.model<FormWithDocType>("Form", formSchema);

export default Form;
