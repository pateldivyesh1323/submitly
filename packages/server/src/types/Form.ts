import { Schema } from "mongoose";

export interface FormType {
  name: string;
  formId: string;
  userId: Schema.Types.ObjectId;
}

export interface FormWithDocType extends FormType, Document {
  createdAt?: Date;
  updatedAt?: Date;
}
