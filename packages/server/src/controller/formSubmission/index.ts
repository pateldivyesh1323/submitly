import { sendEmail } from "../../mails";
import formSubmissionTemplate from "../../mails/templates/formSubmissionTemplate";
import { BadRequestError } from "../../middlewares/error-handler";
import Form from "../../models/Form";
import { FormSubmission } from "../../models/FormSubmissionModel";
import { callWebhooksController } from "../webhooks";
const limit = 10;

async function createFormSubmissionController({ formId, data }: any) {
  let form = await Form.findOne({ formId });
  if (!form) {
    throw new BadRequestError("Form not found");
  }
  let formSubmission = await FormSubmission.create({ formId, response: data });

  // Call webhooks
  callWebhooksController({
    webhookType: "form.submission.created",
    formDocumentId: form._id,
    formId: form.formId,
    formSubmission: data,
  });

  // Send emails
  if (form.email.length > 0) {
    const emailHtml = formSubmissionTemplate(form.name, form.URL, data);
    const emailAddresses = form.email
      .filter((email) => email.active == true)
      .map((email) => email.address);
    await sendEmail({
      to: emailAddresses,
      subject: "Form Submission",
      html: emailHtml,
    });
  }

  return {
    status: 200,
    message: "Form submitted successfully",
    data: formSubmission,
  };
}

async function getFormSubmissionsController(
  formId: string,
  userId: string,
  pageNo = "1" as string,
  sortBy = "latest" as string,
  keyword = "" as string,
) {
  const form = await Form.find({ formId, userId });
  if (!form) {
    throw new BadRequestError("Form not found");
  }

  let query: any = { formId };

  if (keyword) {
    query["$or"] = [
      {
        response: {
          regex: keyword,
          options: "i",
        },
      },
      {
        $expr: {
          $regexMatch: {
            input: {
              $reduce: {
                input: { $objectToArray: "$response" },
                initialValue: "",
                in: {
                  $concat: ["$$value", " ", { $toString: "$$this.v" }],
                },
              },
            },
            regex: keyword,
            options: "i",
          },
        },
      },
    ];
  }

  const formSubmissions = await FormSubmission.find(query)
    .sort({ createdAt: sortBy === "latest" ? -1 : 1 })
    .skip((parseInt(pageNo) - 1) * limit)
    .limit(limit);
  const totalResults = await FormSubmission.countDocuments(query);

  return {
    status: 200,
    message: "Form submissions fetched successfully",
    data: {
      currentPage: parseInt(pageNo),
      formSubmissions,
      totalPages: Math.ceil(totalResults / limit),
    },
  };
}

const deleteFormSubmissionController = async ({
  formId,
  submissionIds,
  userId,
}: any) => {
  const form = await Form.findOne({ formId, userId });

  if (!form) {
    throw new BadRequestError("Form not found");
  }

  await FormSubmission.deleteMany({
    formId,
    _id: { $in: submissionIds },
  });

  return {
    status: 200,
    message: "Form submissions deleted successfully",
  };
};

export {
  createFormSubmissionController,
  getFormSubmissionsController,
  deleteFormSubmissionController,
};
