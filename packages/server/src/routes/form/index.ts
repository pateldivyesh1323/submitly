import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { AppResponse } from "../../middlewares/error-handler";
import {
  createFormController,
  deleteFormController,
  getAllFormsController,
  getFormController,
} from "../../controller/form";

const router = Router();

// Get all forms
router.get("/all", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["userId"] as string;
    const { status, message, data } = await getAllFormsController(userId);
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

// Get form by id
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["userId"] as string;
    const formId = req.params.id;
    const { status, message, data } = await getFormController({
      userId,
      formId,
    });
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

// Create new form
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["userId"] as string;
    const body = req.body;
    const { status, message, data } = await createFormController({
      userId,
      data: body,
    });
    return AppResponse(res, status, message, data);
  } catch (error) {
    next(error);
  }
});

// Delete form
router.delete("/:formId", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.headers["userId"] as string;
    const formId = req.params.formId;
    const { status, message } = await deleteFormController({
      userId,
      formId,
    });
    return AppResponse(res, status, message);
  } catch (error) {
    next(error);
  }
});

export default router;
