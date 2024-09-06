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

export { signUpController };
