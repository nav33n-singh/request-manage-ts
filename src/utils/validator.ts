import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { StatusCodes, StatusMessages } from "../types/common/status-codes";
import { AppError } from "./app-error";

export const validator = (schema: Joi.ObjectSchema) => {
  return (request: Request, _response: Response, next: NextFunction) => {
    const payload = request.body;
    const { value, error } = schema.validate(payload, { abortEarly: false, allowUnknown: false, stripUnknown: true, });
    if (error) {
      const errors = error.details.map((detail) => detail.message.replace(/["]/g, ""));
      return next(new AppError(StatusMessages.VALIDATION_ERROR, StatusCodes.VALIDATION_ERROR, errors))
    }
    request.body = value;
    return next();
  }
}
