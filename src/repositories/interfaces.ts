import { RequestStatus } from "../types/dtos/requests";

export interface CreateRequestQueryParams {
  Request: String,
  RequestorID: number,
  AssigneeID: number,
  ApproverID: number,
  Status: RequestStatus
}

export interface UpdateRequestQueryParams {
  Status: RequestStatus
}

export interface PaginationQueryResult<T> {
  rows: T,
  count: number
}

export interface CreateAuditQueryParams {
  RequestID: number;
  Status: RequestStatus;
  UserID: number
}