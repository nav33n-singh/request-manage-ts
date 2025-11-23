export type RequestStatus =
  | "PendingApproval"
  | "Approved"
  | "Rejected"
  | "Closed";

export interface RequestRow {
  RequestID: number;
  Request: string;
  Status: RequestStatus;

  RequestorID: number;
  AssigneeID: number;
  ApproverID: number | null;

  CreatedAt: Date;
  UpdatedAt: Date;
  Archived: boolean;
}

export interface RequestAuditRow {
  RequestAuditID: number;
  RequestID: number;
  Status: RequestStatus | null;
  UserID: number;
  Comment: string | null;
  CreatedAt: Date;
}
