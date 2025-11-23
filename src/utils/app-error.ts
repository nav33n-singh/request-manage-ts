import { StatusCodes } from "../types/common/status-codes";

export class AppError extends Error {
  public statusCode: number;
  public errors: string[] | null;
  constructor(message: string, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, errors: string[] | null = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}