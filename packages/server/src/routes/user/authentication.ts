import express from "express";
import { AppResponse } from "../../middlewares/error-handler";
import {
  loginController,
  signUpController,
} from "../../controller/user/authentication";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const body = req.body;
    const { status, message, data } = await signUpController(body);
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const body = req.body;
    const { status, message, data } = await loginController(body);
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

export default router;
