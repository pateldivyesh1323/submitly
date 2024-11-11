import { BadRequestError } from "../../middlewares/error-handler";
import Form from "../../models/Form";
import { FormSubmission } from "../../models/FormSubmissionModel";

const validTimeOptions = [7, 30, 365];

const getPerTimeCount = async ({ formId, time, startDate }: any) => {
  let day = true;
  if (time === 365) {
    day = false;
  }

  let aggregationPipeline;

  if (day) {
    aggregationPipeline = [
      {
        $match: {
          formId,
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          submissionCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];
  } else {
    aggregationPipeline = [
      {
        $match: {
          formId,
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          submissionCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];
  }

  const results = await FormSubmission.aggregate(aggregationPipeline as any);
  return results;
};

async function formAnalyticsController({ formId, userId, time }: any) {
  time = parseInt(time);

  if (typeof time !== "number" || !validTimeOptions.includes(time)) {
    throw new BadRequestError("Invalid query parameters");
  }

  const form = await Form.findOne({ formId, userId });

  if (!form) {
    throw new BadRequestError("Form not found");
  }

  const totalSubmissionCount = await FormSubmission.countDocuments({
    formId,
  });

  const now = new Date();
  const startDate = new Date(now.setDate(now.getDate() - time));
  const timeSubmissionCount = await FormSubmission.countDocuments({
    formId,
    createdAt: { $gte: startDate },
  });

  const perTimeCount = await getPerTimeCount({ formId, time, startDate });

  const pastMonthCount = await FormSubmission.countDocuments({
    formId,
    createdAt: { $gte: new Date(now.setDate(now.getDate() - 30)) },
  });

  const pastYearCount = await FormSubmission.countDocuments({
    formId,
    createdAt: { $gte: new Date(now.setDate(now.getDate() - 365)) },
  });

  const pastMonthAverage = pastMonthCount / 30;
  const pastYearAverage = pastYearCount / 365;

  const dataToSend = {
    totalSubmissionCount,
    timeSubmissionCount,
    pastMonthAverage,
    pastYearAverage,
    perTimeCount,
  };

  return {
    status: 200,
    message: "Form analytics fetched successfully",
    data: dataToSend,
  };
}

export { formAnalyticsController };
