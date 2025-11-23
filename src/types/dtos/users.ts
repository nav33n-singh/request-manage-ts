export interface UserRow {
  UserID: number;
  FirstName: string;
  MiddleName: string | null;
  LastName: string | null;
  UserName: string;
  Email: string;
  PasswordHash: string;
  MobileNo: string | null;
  PhoneCode: string | null;
  IsActive: boolean;
  IsBlocked: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  Archived: boolean;
}

export interface AssigneeManagerMappingRow {
  AssigneeManagerMappingID: number;
  AssigneeID: number;
  ManagerID: number;
  IsActive: boolean;
  EffectiveFrom: Date | null;
  EffectiveTo: Date | null;
  CreatedAt: Date;
  UpdatedAt: Date;
  Archived: boolean;
}
