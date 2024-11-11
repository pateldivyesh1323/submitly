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
