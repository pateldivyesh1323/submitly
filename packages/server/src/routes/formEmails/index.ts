import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { updateFormEmailController } from "../../controller/formEmails";
import { AppResponse } from "../../middlewares/error-handler";

const router = Router();

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["userId"] as string;
    const { status, message } = await updateFormEmailController({
      data: req.body,
      userId,
    });
    return AppResponse(res, status, message);
  } catch (error) {
    next(error);
  }
});

export default router;
