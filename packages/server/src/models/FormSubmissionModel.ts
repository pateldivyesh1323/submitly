import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
      ref: "Form",
      required: true,
    },
    response: {
      type: Map,
      of: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const FormSubmission = mongoose.model("FormSubmission", formSubmissionSchema);

export { FormSubmission };
