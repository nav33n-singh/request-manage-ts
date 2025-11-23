export type DepartmentRole = "Assignee" | "Manager";

export interface DepartmentRow {
  DepartmentID: number;
  DepartmentCode: string;
  DepartmentName: string;
  Description?: string | null;
  CreatedAt: Date;
  UpdatedAt: Date;
  Active: boolean;
  Archived: boolean;
}

export interface DepartmentAdministratorRow {
  DepartmentAdministratorID: number;
  DepartmentID: number;
  UserID: number;
  Role: DepartmentRole;
  CreatedAt: Date;
  UpdatedAt: Date;
  Active: boolean;
  Archived: boolean;
}