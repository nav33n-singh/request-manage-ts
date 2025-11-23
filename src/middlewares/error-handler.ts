import { NextFunction, Request, Response } from "express";
import { StatusCodes, StatusMessages } from "../types/common/status-codes";
import { AppError } from "../utils/app-error";

export const errorHandler = async (error: any, _request: Request, response: Response, next: NextFunction) => {
  console.error(error);
  if (error instanceof AppError) {
    const normalisedError = {
      success: false,
      message: error.message || StatusMessages.INTERNAL_SERVER_ERROR,
      errors: error.errors || []
    }
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    return response.status(statusCode).json(normalisedError);
  }

  return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: StatusMessages.INTERNAL_SERVER_ERROR,
    errors: []
  })
}
