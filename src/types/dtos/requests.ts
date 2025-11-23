export type RequestStatus = "PendingApproval" | "Approved" | "Rejected" | "Closed";

export interface RequestRow {
  RequestID: number;
  Request: string;
  Status: RequestStatus;
  DepartmentID: number;
  RequestorID: number,
  AssigneeID: number;
  ApproverID?:  | null;
  CreatedAt: Date;
  UpdatedAt: Date;
  Active: boolean;
  Archived: boolean;
}

export interface RequestAuditRow {
  RequestAuditID: number;
  RequestID: number;
  Status?: RequestStatus | null;
  UserID: number;
  CreatedAt: Date;
}