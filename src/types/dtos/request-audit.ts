import { RequestStatus } from "./requests";

export interface RequestAuditRow {
  RequestAuditID: number;
  RequestID: number;
  Status: RequestStatus | null;
  UserID: number;
  Comment: string | null;
  CreatedAt: Date;
}