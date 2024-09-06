export interface UserType {
  name: string;
  email: string;
  password: string;
}

export interface UserWithDocType extends UserType, Document {
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  generateAuthToken: () => string;
}
