import { sendEmail } from "../../mails";
import formSubmissionTemplate from "../../mails/templates/formSubmissionTemplate";
import {
  BadRequestError,
  NotFoundError,
} from "../../middlewares/error-handler";
import Form from "../../models/Form";
import { FormSubmission } from "../../models/FormSubmissionModel";
import { callWebhooksController } from "../webhooks";
import { Response } from "express";
import { Transform } from "stream";
import { format } from "fast-csv";

const limit = 10;

async function createFormSubmissionController({ formId, data }: any) {
  let form = await Form.findOne({ formId });
  if (!form) {
    throw new BadRequestError("Form not found");
  }
  let formSubmission = await FormSubmission.create({ formId, response: data });

  callWebhooksController({
    webhookType: "form.submission.created",
    formDocumentId: form._id,
    formId: form.formId,
    formName: form.name,
    formSubmission: data,
  });

  if (form.email.length > 0) {
    const emailHtml = formSubmissionTemplate({
      formName: form.name,
      formId: form.formId,
      submissionData: data,
    });
    const emailAddresses = form.email
      .filter((email) => email.active == true)
      .map((email) => email.address);

    await sendEmail({
      to: emailAddresses,
      subject: `Submitly: ${form.name} - Form Submission`,
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

async function downloadFormSubmissionsCSVController(
  formId: string,
  userId: string,
  res: Response,
) {
  const form = await Form.findOne({ formId, userId });
  if (!form) {
    throw new BadRequestError("Form not found");
  }
  const cursor = FormSubmission.find({ formId })
    .sort({ createdAt: -1 })
    .cursor();

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${form.name}_submissions.csv"`,
  );

  const allFields = new Set<string>();
  const submissions: any[] = [];

  for await (const submission of cursor) {
    const responseObj = Object.fromEntries(submission.response);
    Object.keys(responseObj).forEach((field) => allFields.add(field));

    submissions.push({
      id: submission._id.toString(),
      createdAt: submission.createdAt,
      ...responseObj,
    });
  }

  const fieldsList = ["id", "createdAt", ...Array.from(allFields)];

  const transformStream = new Transform({
    objectMode: true,
    transform: (chunk, encoding, callback) => {
      callback(null, chunk);
    },
  });

  const csvStream = format({ headers: fieldsList });

  transformStream.pipe(csvStream).pipe(res);

  submissions.forEach((submission) => {
    const row: any = {
      id: submission.id,
      createdAt: submission.createdAt,
    };

    Array.from(allFields).forEach((field) => {
      row[field] = submission[field] || "";
    });

    transformStream.write(row);
  });

  transformStream.end();
}

async function markAsReadController({
  formId,
  userId,
  submissionId,
}: {
  formId: string;
  userId: string;
  submissionId: string;
}) {
  const form = await Form.findOne({ formId, userId });

  if (!form) {
    throw new BadRequestError("Form not found");
  }

  const submission = await FormSubmission.findOneAndUpdate(
    { _id: submissionId, formId },
    { read: true },
    { new: true },
  );

  if (!submission) {
    throw new NotFoundError("Submission not found");
  }

  return submission;
}

export {
  createFormSubmissionController,
  getFormSubmissionsController,
  deleteFormSubmissionController,
  downloadFormSubmissionsCSVController,
  markAsReadController,
};
