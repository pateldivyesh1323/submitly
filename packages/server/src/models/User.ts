import mongoose, { Schema } from "mongoose";
import { UserModel, UserWithDocType } from "../types/User";
import validator from "validator";
import bcrypt from "bcryptjs";
import environments from "../environments";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../middlewares/error-handler";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxLength: [50, "Name cannot be longer than  characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: [6, "Password must be at least 6 characters long"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign({ id: this._id }, environments.JWT_SECRET as string, {
    expiresIn: "3d",
  });
  return token;
};

userSchema.statics.verifyToken = function (token: string): string {
  try {
    const decoded = jwt.verify(token, environments.JWT_SECRET as string);
    if (typeof decoded === "object" && "id" in decoded) {
      return (decoded as JwtPayload).id as string;
    }
    throw new UnauthorizedError("Invalid token: id not found");
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};

const User = mongoose.model<UserWithDocType, UserModel>("User", userSchema);

export default User;
