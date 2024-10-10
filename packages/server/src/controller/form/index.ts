import { BadRequestError } from "../../middlewares/error-handler";
import Form from "../../models/Form";
import { FormSubmission } from "../../models/FormSubmissionModel";

const createFormController = async ({
  userId,
  data,
}: {
  userId: string;
  data: { name: string };
}) => {
  const { name } = data;
  if (!name) {
    throw new BadRequestError("Form name is required");
  }
  const form = await Form.create({ name, userId });
  return {
    status: 200,
    message: "Form created successfully",
    data: form,
  };
};

const getFormController = async ({
  userId,
  formId,
}: {
  userId: string;
  formId: string;
}) => {
  if (!formId) {
    throw new BadRequestError("Form id is required");
  }
  const form = await Form.findOne({ formId, userId });
  if (!form) {
    throw new BadRequestError("Form not found");
  }
  return {
    status: 200,
    message: "Form fetched successfully",
    data: form,
  };
};

const getAllFormsController = async (userId: string) => {
  const forms = await Form.find({ userId });
  return {
    status: 200,
    message: "Forms fetched successfully",
    data: forms,
  };
};

const deleteFormController = async ({
  userId,
  formId,
}: {
  userId: string;
  formId: string;
}) => {
  const form = await Form.findOneAndDelete({ formId, userId });
  if (!form) {
    throw new BadRequestError("Form not found");
  }
  await FormSubmission.deleteMany({ formId });
  return {
    status: 200,
    message: "Form deleted successfully",
  };
};

export {
  createFormController,
  getFormController,
  getAllFormsController,
  deleteFormController,
};
