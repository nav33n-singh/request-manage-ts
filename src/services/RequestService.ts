import { RequestRepository } from "../repositories/RequestRepositories";
import { AsigneeManagerMappingRepository } from "../repositories/AsigneeManagerMappingRepository";
import { RequestAuditRepository } from "../repositories/RequestAuditRepositories";
import { AppError } from "../utils/app-error";
import { StatusCodes, StatusMessages } from "../types/common/status-codes";
import { ResponseBoolean } from "../types/common/response";
import { CreateRequestCommand, ApproveRejectRequestCommand, CloseRequestCommand, RequestDetails, PaginatedResult } from "../types/states/request";
import { AsyncContext } from "../utils/async-context";
import { IAppRequestService } from "./interfaces";
import { CommonPaginationRequest } from "../types/common/request";
import { RequestRow, RequestStatus } from "../types/dtos/requests";
import { UserMeta } from "../types/states/user";
import { UserRepository } from "../repositories/UserRepository";

export class RequestService implements IAppRequestService {
  private repo = new RequestRepository();
  private userRepo = new UserRepository();
  private mappingRepo = new AsigneeManagerMappingRepository();
  private auditRepo = new RequestAuditRepository();

  public async getUserMetaByIDs(ids: number[]): Promise<Promise<Record<number, UserMeta>>> {
    const repoResult = await this.userRepo.findByIDs(ids);

    const result: Record<number, UserMeta> = {};
    repoResult.forEach(row => {
      const meta: UserMeta = {
        id: row.UserID,
        firstName: row.FirstName,
        middleName: row.MiddleName,
        lastName: row.LastName,
        email: row.Email
      }
      result[row.UserID] = meta;
    });

    return result;
  }

  public async createRequest(command: CreateRequestCommand): Promise<ResponseBoolean> {
    const user = AsyncContext.getAuthUser()!;
    const managerID = await this.mappingRepo.getManagerForAssignee(command.assigneeId);
    const createRequestParams = {
      Request: command.request,
      RequestorID: user.id,
      AssigneeID: command.assigneeId,
      ApproverID: managerID,
      Status: "PendingApproval" as RequestStatus
    }
    const request = await this.repo.createRequest(createRequestParams);

    const createRequestAuditParams = {
      RequestID: request.RequestID,
      Status: request.Status,
      UserID: user.id,
      Comment: "Created"
    }

    await this.auditRepo.createAudit(createRequestAuditParams);

    return { success: true };
  }

  async approveRejectRequest(command: ApproveRejectRequestCommand): Promise<ResponseBoolean> {
    const user = AsyncContext.getAuthUser()!;
    const requestRow = await this.repo.getRequestById(command.requestId);
    if (user.id !== requestRow?.ApproverID) {
      throw new AppError(StatusMessages.FORBIDDEN, StatusCodes.FORBIDDEN);
    }
    if (requestRow.Status !== "PendingApproval") {
      throw new AppError("Request is not pending approval", StatusCodes.BAD_REQUEST);
    }

    const updateParams = {
      Status: command.action,
    }
    await this.repo.updateStatus(command.requestId, updateParams);

    const auditParams = {
      RequestID: command.requestId,
      Status: command.action,
      UserID: user.id,
      Comment: command.comment
    }
    await this.auditRepo.createAudit(auditParams);

    return { success: true };
  }

  async closeRequest(command: CloseRequestCommand): Promise<ResponseBoolean> {
    const user = AsyncContext.getAuthUser()!;

    const requestRow = await this.repo.getRequestById(command.requestId);

    if (requestRow!.AssigneeID !== user.id) {
      throw new AppError("Only assignee can close the request", StatusCodes.FORBIDDEN);
    }
    if (requestRow!.Status !== "Approved") {
      throw new AppError("Request must be approved before closing", StatusCodes.BAD_REQUEST);
    }

    const updateParams = {
      Status: "Closed" as RequestStatus,
      ApproverID: user.id
    }
    await this.repo.updateStatus(command.requestId, updateParams);

    const updateAuditParams = {
      RequestID: command.requestId,
      Status: "Closed" as RequestStatus,
      UserID: user.id,
      Comment: null
    }
    await this.auditRepo.createAudit(updateAuditParams);

    return { success: true };
  }

  async getCurrentUserRequests(command: CommonPaginationRequest): Promise<PaginatedResult<RequestDetails[]>> {
    const user = AsyncContext.getAuthUser()!;

    const repoResult = await this.repo.getRequestsByRequestor(user.id, command);
    const { rows, count } = repoResult;
    const userIDs = rows.reduce((acc: number[], row: RequestRow) => {
      if(row.ApproverID) acc.push(row.ApproverID);
      if(row.RequestorID) acc.push(row.RequestorID);
      if(row.AssigneeID) acc.push(row.AssigneeID);
      return acc;
    }, [])

    const userMetas = await this.getUserMetaByIDs(userIDs);
    const details: RequestDetails[] = [];
    for(let row of rows) {
      const detail: RequestDetails = {
        requestID: row.RequestID,
        request: row.Request,
        status: row.Status,
        requestor: userMetas[row.RequestorID],
        assignee: userMetas[row.AssigneeID],
        approver: row.ApproverID? userMetas[row.ApproverID]: null,
        createdAt: row.CreatedAt,
        updatedAt: row.UpdatedAt
      }
      details.push(detail);
    }
    const result: PaginatedResult<RequestDetails[]> = {
      records: details,
      total: count || 0
    }
    return result;
  }

  async getManagerQueue(command: CommonPaginationRequest): Promise<PaginatedResult<RequestDetails[]>> {
    const user = AsyncContext.getAuthUser()!;

    const repoResult = await this.repo.getQueuedRequestsForManager(user.id, command);
    const { rows, count } = repoResult;
    const userIDs = rows.reduce((acc: number[], row: RequestRow) => {
      if(row.ApproverID) acc.push(row.ApproverID);
      if(row.RequestorID) acc.push(row.RequestorID);
      if(row.AssigneeID) acc.push(row.AssigneeID);
      return acc;
    }, [])

    const userMetas = await this.getUserMetaByIDs(userIDs);
    const details: RequestDetails[] = [];
    for(let row of rows) {
      const detail: RequestDetails = {
        requestID: row.RequestID,
        request: row.Request,
        status: row.Status,
        requestor: userMetas[row.RequestorID],
        assignee: userMetas[row.AssigneeID],
        approver: row.ApproverID? userMetas[row.ApproverID]: null,
        createdAt: row.CreatedAt,
        updatedAt: row.UpdatedAt
      }
      details.push(detail);
    }
    const result: PaginatedResult<RequestDetails[]> = {
      records: details,
      total: count || 0
    }
    return result;
  }

  async getAssigneeQueue(command: CommonPaginationRequest): Promise<PaginatedResult<RequestDetails[]>> {
    const user = AsyncContext.getAuthUser()!;

    const repoResult = await this.repo.getQueuedRequestsForAssignee(user.id, command);
    const { rows, count } = repoResult;
    const userIDs = rows.reduce((acc: number[], row: RequestRow) => {
      if(row.ApproverID) acc.push(row.ApproverID);
      if(row.RequestorID) acc.push(row.RequestorID);
      if(row.AssigneeID) acc.push(row.AssigneeID);
      return acc;
    }, [])

    const userMetas = await this.getUserMetaByIDs(userIDs);
    const details: RequestDetails[] = [];
    for(let row of rows) {
      const detail: RequestDetails = {
        requestID: row.RequestID,
        request: row.Request,
        status: row.Status,
        requestor: userMetas[row.RequestorID],
        assignee: userMetas[row.AssigneeID],
        approver: row.ApproverID? userMetas[row.ApproverID]: null,
        createdAt: row.CreatedAt,
        updatedAt: row.UpdatedAt
      }
      details.push(detail);
    }
    const result: PaginatedResult<RequestDetails[]> = {
      records: details,
      total: count || 0
    }
    return result;
  }
}
