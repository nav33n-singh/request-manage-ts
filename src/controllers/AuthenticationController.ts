import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from '../services/AuthenticationService'
import { StatusCodes, StatusMessages } from "../types/common/status-codes";

export class AuthenticationController {
  public async authenticateUser(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = request.body;
      const authenticationService = AuthenticationService.getInstance();
      const authenticatedUser = await authenticationService.authenticateUser(payload);
      const result = {
        success: true,
        message: StatusMessages.OK,
        data: { token: authenticatedUser }
      }
      return response.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      return next(error);
    }
  }
}
