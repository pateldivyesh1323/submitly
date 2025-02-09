import { Router } from "express";
import { AppResponse } from "../../middlewares/error-handler";
import { createWebhookController } from "../../controller/webhooks";
import authMiddleware from "../../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const data = req.body;
    const userId = req.headers["userId"] as string;
    const { status, message } = await createWebhookController({
      userId,
      data,
    });
    return AppResponse(res, status, message);
  } catch (error) {
    next(error);
  }
});

export default router;
