import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
      enum: ["GET", "POST"],
      default: "POST",
    },
    active: {
      type: Boolean,
      default: true,
    },
    secret: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Webhook = mongoose.model("Webhook", webhookSchema);

export default Webhook;
