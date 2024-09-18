import { NextFunction, Request, Response } from "express";
import FormApiKey from "../models/FormApiKey";
import { UnauthorizedError } from "./error-handler";
import Form from "../models/Form";

export default async function formSubmissionMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  try {
    const formId = req.headers["form-id"];
    const formApiKey = req.headers["form-api-key"];
    if (!formId || !formApiKey) {
      throw new UnauthorizedError("form-id and form-api-key are required");
    }
    const checkApiKey = await FormApiKey.findOne({ key: formApiKey });
    if (!checkApiKey) {
      throw new UnauthorizedError("Invalid API key");
    }
    if (checkApiKey.active === false) {
      throw new UnauthorizedError("API key is inactive");
    }
    const userId = checkApiKey.user;
    const checkFormId = await Form.findOne({ formId, userId });
    if (!checkFormId) {
      throw new UnauthorizedError("Invalid form id");
    }

    req.headers["form-id"] = checkFormId.formId;
    next();
  } catch (error) {
    next(error);
  }
}
