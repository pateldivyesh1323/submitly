import express from "express";
import { AppResponse } from "../../middlewares/error-handler";
import authMiddleware from "../../middlewares/authMiddleware";
import {
  generateApiKeyController,
  getApiKeyController,
} from "../../controller/apiKey";

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["userId"] as string;
    const { status, message, data } = await getApiKeyController({ userId });
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

router.get("/generate", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["userId"] as string;
    const { status, message, data } = await generateApiKeyController({
      userId,
    });
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

export default router;
