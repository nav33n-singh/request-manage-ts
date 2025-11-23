import { RequestStatus } from "../dtos/requests";

export interface CreateRequestAuditCommand {
  requestId: number;
  status: Extract<RequestStatus, "Approved" | "Rejected" | "Closed">
  userId: number;
  comment: string | null
}