import { Router } from "express";
import formSubmissionMiddleware from "../../middlewares/formSubmissionMiddleware";
import { AppResponse, BadRequestError } from "../../middlewares/error-handler";
import createFormSubmissionController from "../../controller/formSubmission";

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

export default router;
