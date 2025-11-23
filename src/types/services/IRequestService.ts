import { CommonPaginationRequest } from "../common/request";
import { ResponseBoolean } from "../common/response";
import { ApproveRejectRequestCommand, CloseRequestCommand, CreateRequestCommand, RequestDetails } from "../states/request";

export interface IRequestService {
  createRequest(command: CreateRequestCommand): Promise<ResponseBoolean>;
  approveRejectRequest(command: ApproveRejectRequestCommand): Promise<ResponseBoolean>;
  closeRequest(command: CloseRequestCommand): Promise<ResponseBoolean>;
  getCurrentUserRequests(command: CommonPaginationRequest): Promise<RequestDetails[]>;
  getQueuedRequests(command: CommonPaginationRequest): Promise<RequestDetails[]>;
}