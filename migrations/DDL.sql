-- ENUMS
CREATE TYPE RequestStatus AS ENUM ('PendingApproval', 'Approved', 'Rejected', 'Closed');
CREATE TYPE DepartmentRole AS ENUM ('Assignee', 'Manager');

-- Generic trigger function to update UpdatedAt on UPDATE
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."UpdatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users
CREATE TABLE users (
  `UserID`            BIGSERIAL PRIMARY KEY,
  `FirstName`         TEXT NOT NULL,
  `MiddleName`        TEXT,
  `LastName`          TEXT,
  `UserName`          TEXT NOT NULL UNIQUE,
  `Email`             TEXT NOT NULL UNIQUE,
  `PasswordHash`      TEXT NOT NULL,
  `MobileNo`          TEXT,
  `PhoneCode`         TEXT,
  `IsActive`          BOOLEAN NOT NULL DEFAULT TRUE,
  `IsBlocked`         BOOLEAN NOT NULL DEFAULT FALSE,
  `CreatedAt`         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  `UpdatedAt`         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  `Archived`          BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


-- departments
CREATE TABLE departments (
  `DepartmentID`      BIGSERIAL PRIMARY KEY,
  `DepartmentCode`    TEXT NOT NULL UNIQUE,
  `DepartmentName`    TEXT NOT NULL,
  `Description`       TEXT,
  `CreatedAt`         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  `UpdatedAt`         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  `Active`            BOOLEAN NOT NULL DEFAULT TRUE,
  `Archived`          BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TRIGGER trg_departments_updated
BEFORE UPDATE ON "departments"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


CREATE TABLE department_administrators (
  DepartmentAdministratorID BIGSERIAL PRIMARY KEY,
  DepartmentID              BIGINT NOT NULL REFERENCES Department(DepartmentID) ON DELETE CASCADE,
  UserID                    BIGINT NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
  Role                      DepartmentRole NOT NULL,
  CreatedAt                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UpdatedAt                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  Active          BOOLEAN NOT NULL DEFAULT TRUE,
  Archived        BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (DepartmentID, UserID)
);

CREATE TRIGGER trg_department_administrators_updated
BEFORE UPDATE ON "department_administrators"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


-- requests
CREATE TABLE requests (
  RequestID       BIGSERIAL PRIMARY KEY,
  Request         TEXT NOT NULL,
  Status          RequestStatus NOT NULL DEFAULT 'PendingApproval',
  DepartmentID    BIGINT NOT NULL REFERENCES Department(DepartmentID),
  RequestorID      BIGINT REFERENCES Users(UserID),
  AssigneeID      BIGINT NOT NULL REFERENCES Users(UserID),
  ApproverID      BIGINT REFERENCES Users(UserID),
  CreatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UpdatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  Active          BOOLEAN NOT NULL DEFAULT TRUE,
  Archived        BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TRIGGER trg_requests_updated
BEFORE UPDATE ON "requests"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


-- request audit / history
CREATE TABLE request_audit (
  RequestAuditID  BIGSERIAL PRIMARY KEY,
  RequestID       BIGINT NOT NULL REFERENCES Request(RequestID) ON DELETE CASCADE,
  Status          RequestStatus,
  UserID          BIGINT NOT NULL REFERENCES Users(UserID),
  CreatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- indexes

CREATE INDEX IF NOT EXISTS idx_requests_department ON "Requests"("DepartmentID");
CREATE INDEX IF NOT EXISTS idx_requests_assignee ON "Requests"("AssigneeID");
CREATE INDEX IF NOT EXISTS idx_requests_approver ON "Requests"("ApproverID");
CREATE INDEX IF NOT EXISTS idx_department_admin_dept_role ON "DepartmentAdministrators"("DepartmentID", "Role");