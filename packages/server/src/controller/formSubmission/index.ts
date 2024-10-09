import { BadRequestError } from "../../middlewares/error-handler";
import Form from "../../models/Form";
import { FormSubmission } from "../../models/FormSubmissionModel";

async function createFormSubmissionController({ formId, data }: any) {
  let formSubmission = await FormSubmission.create({ formId, response: data });
  return {
    status: 200,
    message: "Form submitted successfully",
    data: formSubmission,
  };
}

async function getFormSubmissionsController(formId: string, userId: string) {
  const form = await Form.find({ formId, userId });
  if (!form) {
    throw new BadRequestError("Form not found");
  }
  const formSubmissions = await FormSubmission.find({ formId });
  return {
    status: 200,
    message: "Form submissions fetched successfully",
    data: formSubmissions,
  };
}

export { createFormSubmissionController, getFormSubmissionsController };
