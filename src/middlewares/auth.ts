import { NextFunction, Request, Response } from "express";
import { OPEN_ROUTES } from "../constants/constants";
import { AppError } from "../utils/app-error";
import { StatusCodes, StatusMessages } from "../types/common/status-codes";
import { AsyncContext } from "../utils/async-context";
import { AuthenticationService } from "../services/AuthenticationService";

export const auth = async (request: Request, _response: Response, next: NextFunction) => {
  try {
    const path = request.path;
    const { authorization } = request.headers
    if (OPEN_ROUTES.includes(path)) {
      return next();
    }
    if (authorization) {
      const authService = AuthenticationService.getInstance();
      const authUser = await authService.verifyJsonWebToken(authorization);
      AsyncContext.setAuthUser(authUser);
      return next()
    }
    return next(new AppError(StatusMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED))
  } catch (error: any) {
    return next(error);
  }
}
