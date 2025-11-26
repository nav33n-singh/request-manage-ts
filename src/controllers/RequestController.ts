import { NextFunction, Request, Response } from "express";
import { RequestService } from "../services/RequestService";
import { CreateRequestCommand, ApproveRejectRequestCommand, CloseRequestCommand } from "../types/states/request";
import { CommonPaginationRequest } from "../types/common/request";
import { StatusCodes, StatusMessages } from "../types/common/status-codes";
import { UserMeta } from "../types/states/user";

export class RequestController {
  public async createRequest(request: Request, response: Response, next: NextFunction) {
    try {
      const command = request.body as CreateRequestCommand;
      const service = new RequestService();
      const data = await service.createRequest(command);
      const result = {
        success: true,
        message: StatusMessages.OK,
        data: data
      }
      return response.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async approveRejectRequest(request: Request, response: Response, next: NextFunction) {
    try {
      const command = request.body as ApproveRejectRequestCommand;
      const service = new RequestService();
      await service.approveRejectRequest(command);
      const result = {
        success: true,
        message: StatusMessages.OK,
        data: {}
      }
      return response.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async closeRequest(request: Request, response: Response, next: NextFunction) {
    try {
      const command = request.body as CloseRequestCommand;
      const service = new RequestService();
      await service.closeRequest(command);
      const result = {
        success: true,
        message: StatusMessages.OK,
        data: {}
      }
      return response.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async getCurrentUserRequests(request: Request, response: Response, next: NextFunction) {
    try {
      const command = request.body as CommonPaginationRequest;
      const page = Number(command.page || 1);
      const count = Number(command.count || 20);
      const service = new RequestService();
      const data = await service.getCurrentUserRequests({ page, count });
      const result = {
        success: true,
        message: StatusMessages.OK,
        data: data
      }
      return response.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async getManagerQueue(request: Request, response: Response, next: NextFunction) {
    try {
      const command = request.body as CommonPaginationRequest;
      const page = Number(command.page || 1);
      const count = Number(command.count || 20);
      const service = new RequestService();
      const data = await service.getManagerQueue({ page, count });
      const result = {
        success: true,
        message: StatusMessages.OK,
        data: data
      }
      return response.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async getAssigneeQueue(request: Request, response: Response, next: NextFunction) {
    try {
      const command = request.body as CommonPaginationRequest;
      const page = Number(command.page || 1);
      const count = Number(command.count || 20);
      const service = new RequestService();
      const data = await service.getAssigneeQueue({ page, count });
      const result = {
        success: true,
        message: StatusMessages.OK,
        data: data
      }
      return response.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async getAllAssignees(request: Request, response: Response, next: NextFunction) {
    try {
      const service = new RequestService();
      const data = await service.getAllAssignees();
      const result = {
        success: true,
        message: StatusMessages.OK,
        data: data
      }
      return response.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
}
