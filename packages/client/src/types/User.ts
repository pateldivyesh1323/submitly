export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export type SignUpDataInterface = Omit<User, "_id">;
