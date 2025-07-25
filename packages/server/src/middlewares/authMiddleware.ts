import { Request, Response, NextFunction } from "express";
import { NotFoundError, UnauthorizedError } from "./error-handler";
import User from "../models/User";
import { Socket } from "socket.io";

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

export async function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error | undefined) => void,
) {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decodedUserId = User.verifyToken(token);

    const user = await User.findById(decodedUserId);

    if (!user) {
      throw new NotFoundError("No user found");
    }

    socket.data.user = user;

    next();
  } catch (err) {
    next(new Error(err as string));
  }
}
