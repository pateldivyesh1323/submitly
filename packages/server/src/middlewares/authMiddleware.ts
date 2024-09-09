import { Request, Response, NextFunction } from "express";
import { NotFoundError, UnauthorizedError } from "./error-handler";
import User from "../models/User";

export default async function authMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decodedUserId = User.verifyToken(token);

    const user = await User.findById(decodedUserId);

    if (!user) {
      throw new NotFoundError("No user found");
    }

    req.headers["userId"] = decodedUserId;
    req.headers["authorized"] = "true";
    next();
  } catch (err) {
    next(err);
  }
}
