import { UserType } from "./User";

export interface FormApiKeyType {
  user: UserType;
  key: string;
  active: boolean;
}

export interface FormApiKeyWithDocType extends FormApiKeyType, Document {
  createdAt?: Date;
  updatedAt?: Date;
}
