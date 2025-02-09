export interface FormType {
  name: string;
  userId: string;
  formId: string;
}

export type FormsType = FormType[];

export type AnalyticsChartDataType = {
  _id: string;
  submissionCount: number;
};

export type FormSubmissionType = {
  _id: string;
  response: Record<string, string>;
};

export type FormSubmissionsType = FormSubmissionType[];

export type WebhookType = {
  _id: string;
  title: string;
  url: string;
  form: FormType;
  method: "GET" | "POST";
  active: boolean;
  secret: string;
  createdAt: Date;
  updatedAt: Date;
};
