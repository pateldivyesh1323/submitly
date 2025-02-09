import mongoose from "mongoose";
import { BadRequestError } from "../../middlewares/error-handler";
import Form from "../../models/Form";
import Webhook from "../../models/Webhook";

async function createWebhookController({
  userId,
  data,
}: {
  userId: string;
  data: any;
}) {
  const { title, formId, url, method, secret } = data;
  if (!title || !formId || !url || !method) {
    throw new BadRequestError("All fields are required");
  }

  const form = await Form.findOne({ formId, userId });
  if (!form) {
    throw new BadRequestError("Form not found");
  }

  if (form.userId.toString() !== userId) {
    throw new BadRequestError(
      "You are not authorized to create a webhook for this form",
    );
  }
  const webhook = await Webhook.create({
    title,
    form: form._id,
    url,
    method,
    active: true,
    secret,
  });

  if (!form.webhook) {
    form.webhook = [];
  }

  form.webhook.push(webhook._id);
  await form.save();

  return {
    status: 201,
    message: "Webhook created successfully",
    data: webhook,
  };
}

export { createWebhookController };
