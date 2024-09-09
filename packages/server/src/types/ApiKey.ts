import { UserType } from "./User";

export interface ApiKeyType {
  user: UserType;
  key: string;
  active: boolean;
}

export interface ApiKeyWithDocType extends ApiKeyType, Document {
  createdAt?: Date;
  updatedAt?: Date;
}
