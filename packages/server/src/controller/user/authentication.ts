import {
  BadRequestError,
  ConflictError,
} from "../../middlewares/error-handler";
import User from "../../models/User";
import { UserType } from "../../types/User";

const signUpController = async (data: UserType) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all the details");
  }

  const userExists = await User.exists({ email });
  if (userExists) {
    throw new ConflictError("User already exists");
  }
  let user = await User.create({ name, email, password });
  if (!user) {
    throw new Error();
  }
  const { _id, name: userName, email: userEmail } = user;
  const token = user.generateAuthToken();
  return {
    status: 201,
    message: "Signup successful",
    data: { _id, name: userName, email: userEmail, token },
  };
};

const loginController = async (data: Omit<UserType, "name">) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new BadRequestError("Please provide all the details");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("User not found");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new BadRequestError("Invalid credentials");
  }

  const { _id, name, email: userEmail } = user;
  const token = user.generateAuthToken();
  return {
    status: 200,
    message: "Login successful",
    data: { _id, name, email: userEmail, token },
  };
};

export { signUpController, loginController };
