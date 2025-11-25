import { RequestStatus } from "../dtos/requests";
import { UserMeta } from "./user";

export interface CreateRequestCommand {
  request: string;
  assigneeId: number;
}

export interface ApproveRejectRequestCommand {
  requestId: number;
  action:  Extract<RequestStatus, "Approved" | "Rejected">;
  comment: string | null;
}

export interface CloseRequestCommand {
  requestId: number;
}

export interface RequestDetails {
  requestID: number;
  request: string;
  status: RequestStatus;
  requestor: UserMeta;
  assignee: UserMeta;
  approver: UserMeta | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResult<T> {
  records: T;
  total: number
}