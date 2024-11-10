import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { formAnalyticsController } from "../../controller/formAnalytics";
import { AppResponse } from "../../middlewares/error-handler";

const router = Router();

router.get("/:formId", authMiddleware, async (req, res, next) => {
  try {
    const { formId } = req.params;
    const { time = "30" } = req.query;
    const userId = req.headers["userId"];
    const { status, data, message } = await formAnalyticsController({
      formId,
      userId,
      time,
    });
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

export default router;
