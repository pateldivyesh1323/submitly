import { Types } from "mongoose";

export interface FormType {
  name: string;
  formId: string;
  userId: Types.ObjectId;
  active: boolean;
  webhook: Types.ObjectId[];
}

export interface FormWithDocType extends FormType, Document {
  createdAt?: Date;
  updatedAt?: Date;
}
