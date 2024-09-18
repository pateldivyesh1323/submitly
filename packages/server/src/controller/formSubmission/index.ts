import { stat } from "fs";
import { FormSubmission } from "../../models/FormSubmissionModel";

export default async function createFormSubmissionController({
  formId,
  data,
}: any) {
  let formSubmission = await FormSubmission.create({ formId, response: data });
  return {
    status: 200,
    message: "Form submitted successfully",
    data: formSubmission,
  };
}
