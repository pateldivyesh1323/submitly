import {
  BadRequestError,
  NotFoundError,
} from "../../middlewares/error-handler";
import Form from "../../models/Form";

const updateFormEmailController = async ({
  data,
  userId,
}: {
  data: any;
  userId: string;
}) => {
  const { formId, emails } = data;

  if (!formId) {
    throw new BadRequestError("Form ID is required");
  }

  const form = await Form.findOne({ formId, userId });
  if (!form) {
    throw new NotFoundError("Form not found");
  }

  form.email = emails;
  await form.save();

  return {
    status: 200,
    message: "Emails updated successfully",
  };
};

export { updateFormEmailController };
