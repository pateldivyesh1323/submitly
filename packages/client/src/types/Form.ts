import { z } from "zod";

export const formSchema = z.object({
  name: z.string(),
  userId: z.string(),
  formId: z.string(),
});

export const webhookSchema = z.object({
  _id: z.string(),
  title: z.string(),
  url: z.string().url("Invalid URL"),
  form: formSchema,
  method: z.enum(["GET", "POST"]),
  active: z.boolean(),
  secret: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  type: z.literal("form.submission.created"),
});

export const formSubmissionSchema = z.object({
  _id: z.string(),
  response: z.record(z.string()),
});

// Derive types from schemas
export type FormType = z.infer<typeof formSchema>;
export type FormsType = FormType[];

export type WebhookType = z.infer<typeof webhookSchema>;
export type FormSubmissionType = z.infer<typeof formSubmissionSchema>;
export type FormSubmissionsType = FormSubmissionType[];

export type AnalyticsChartDataType = {
  _id: string;
  submissionCount: number;
};
