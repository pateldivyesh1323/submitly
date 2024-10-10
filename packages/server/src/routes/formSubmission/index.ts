import { Router } from "express";
import formSubmissionMiddleware from "../../middlewares/formSubmissionMiddleware";
import { AppResponse, BadRequestError } from "../../middlewares/error-handler";
import {
  createFormSubmissionController,
  getFormSubmissionsController,
} from "../../controller/formSubmission";
import authMiddleware from "../../middlewares/authMiddleware";

const router = Router();

router.post("/", formSubmissionMiddleware, async (req, res, next) => {
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
    const userId = req.headers["userId"] as string;
    const { status, message, data } = await getFormSubmissionsController(
      formId,
      userId,
      pageNo,
    );
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

export default router;
