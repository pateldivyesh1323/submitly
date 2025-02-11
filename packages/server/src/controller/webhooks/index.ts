import axios from "axios";
import { BadRequestError } from "../../middlewares/error-handler";
import Form from "../../models/Form";
import Webhook from "../../models/Webhook";
import mongoose from "mongoose";

async function createWebhookController({
  userId,
  data,
}: {
  userId: string;
  data: any;
}) {
  const { title, formId, url, method, secret, active, type } = data;
  if (!title || !formId || !url || !method || !type) {
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
    active,
    secret,
    type,
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

const updateWebhookController = async ({
  userId,
  data,
}: {
  userId: string;
  data: any;
}) => {
  const { title, formId, url, method, secret, active, webhookId, type } = data;
  if (!title || !url || !method || !webhookId || !type) {
    throw new BadRequestError("All fields are required");
  }

  const webhook = await Webhook.findOne({ _id: webhookId }).populate("form");

  if (!webhook) {
    throw new BadRequestError("Webhook not found");
  }

  const form = await Form.findOne({ _id: webhook.form, userId });

  if (!form) {
    throw new BadRequestError("Form not found");
  }

  if (form.userId.toString() !== userId) {
    throw new BadRequestError("You are not authorized to update this webhook");
  }

  webhook.title = title;
  webhook.url = url;
  webhook.method = method;
  webhook.secret = secret;
  webhook.active = active;
  webhook.type = type;
  await webhook.save();

  return {
    status: 200,
    message: "Webhook updated successfully",
    data: webhook,
  };
};

const deleteWebhookController = async ({
  userId,
  data,
}: {
  userId: string;
  data: any;
}) => {
  const { webhookId } = data;
  if (!webhookId) {
    throw new BadRequestError("Webhook ID is required");
  }

  const webhook = await Webhook.findOne({ _id: webhookId });
  if (!webhook) {
    throw new BadRequestError("Webhook not found");
  }

  const form = await Form.findOne({ _id: webhook.form, userId });
  if (!form) {
    throw new BadRequestError("Form not found");
  }

  const webhookIndex = form.webhook.indexOf(webhook._id);
  if (webhookIndex === -1) {
    throw new BadRequestError("Webhook not found");
  }

  form.webhook.splice(webhookIndex, 1);
  await form.save();

  await Webhook.deleteOne({ _id: webhookId });

  return {
    status: 200,
    message: "Webhook deleted successfully",
  };
};

const callWebhooksController = async ({
  formId,
  formSubmission,
  webhookType,
  formDocumentId,
}: {
  webhookType: string;
  formId: string;
  formDocumentId: mongoose.Types.ObjectId;
  formSubmission: any;
}) => {
  const webhooks = await Webhook.find({
    form: formDocumentId,
    type: webhookType,
  });

  if (webhooks.length === 0) {
    return;
  }
  for (const webhook of webhooks) {
    const { url, method, secret, active } = webhook;
    if (!active) {
      continue;
    }
    try {
      await axios({
        url,
        method,
        data: {
          type: webhookType,
          formId,
          data: formSubmission,
        },
        headers: {
          "Content-Type": "application/json",
          "submitly-webhook-secret": secret,
        },
      });
    } catch (error) {
      continue;
    }
  }
};

export {
  createWebhookController,
  updateWebhookController,
  deleteWebhookController,
  callWebhooksController,
};
