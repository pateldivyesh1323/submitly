import { Router } from "express";
import formSubmissionMiddleware from "../../middlewares/formSubmissionMiddleware";
import { AppResponse, BadRequestError } from "../../middlewares/error-handler";
import {
  createFormSubmissionController,
  getFormSubmissionsController,
} from "../../controller/formSubmission";
import authMiddleware from "../../middlewares/authMiddleware";
import rateLimit from "express-rate-limit";

const router = Router();

// Form Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Maximum 10 requests per IP address
  message: async (req: any, res: any) => {
    res.status(429).json({
      message: "Too many requests. Please try again later",
    });
  },
});

router.post("/", formSubmissionMiddleware, limiter, async (req, res, next) => {
  try {
    const formId = req.headers["form-id"];
    const body = req.body;
    if (!body) {
      throw new BadRequestError("Body is required");
    }
    const { status, message, data } = await createFormSubmissionController({
      formId,
      data: body,
    });
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

router.get("/:formId", authMiddleware, async (req, res, next) => {
  try {
    const formId = req.params.formId;
    const pageNo = req.query.page as string;
    const sortBy = req.query.sort as string;
    const userId = req.headers["userId"] as string;
    const { status, message, data } = await getFormSubmissionsController(
      formId,
      userId,
      pageNo,
      sortBy,
    );
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

export default router;
