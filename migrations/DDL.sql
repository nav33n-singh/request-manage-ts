-- ===========================================================
-- ENUMS
-- ===========================================================

CREATE TYPE request_status AS ENUM (
  'PendingApproval',
  'Approved',
  'Rejected',
  'Closed'
);

-- ===========================================================
-- Generic UpdatedAt trigger
-- ===========================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================================
-- USERS
-- ===========================================================

CREATE TABLE users (
  "UserID"        BIGSERIAL PRIMARY KEY,
  "FirstName"     TEXT NOT NULL,
  "MiddleName"    TEXT,
  "LastName"      TEXT,
  "UserName"      TEXT NOT NULL UNIQUE,
  "Email"         TEXT NOT NULL UNIQUE,
  "PasswordHash"  TEXT NOT NULL,
  "MobileNo"      TEXT,
  "PhoneCode"     TEXT,
  "IsActive"      BOOLEAN NOT NULL DEFAULT TRUE,
  "IsBlocked"     BOOLEAN NOT NULL DEFAULT FALSE,
  "CreatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "UpdatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "Archived"      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ===========================================================
-- ASSIGNEE – MANAGER MAPPINGS
-- ===========================================================

CREATE TABLE assignee_manager_mappings (
  "AssigneeManagerMappingID" BIGSERIAL PRIMARY KEY,
  "AssigneeID" BIGINT NOT NULL REFERENCES users("UserID") ON DELETE CASCADE,
  "ManagerID"  BIGINT NOT NULL REFERENCES users("UserID") ON DELETE CASCADE,
  "IsActive"   BOOLEAN NOT NULL DEFAULT TRUE,
  "EffectiveFrom" TIMESTAMPTZ,
  "EffectiveTo"   TIMESTAMPTZ,
  "CreatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "UpdatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "Archived"      BOOLEAN NOT NULL DEFAULT FALSE
  
  UNIQUE ("AssigneeID", "ManagerID")
);

CREATE INDEX idx_assignee_manager_assignee ON assignee_manager_mappings ("AssigneeID");
CREATE INDEX idx_assignee_manager_manager  ON assignee_manager_mappings ("ManagerID");

CREATE TRIGGER trg_assignee_mgr_updated
BEFORE UPDATE ON assignee_manager_mappings
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ===========================================================
-- REQUESTS
-- ===========================================================

CREATE TABLE requests (
  "RequestID"       BIGSERIAL PRIMARY KEY,
  "Request"         TEXT NOT NULL,
  "Status"          request_status NOT NULL DEFAULT 'PendingApproval',
  "RequestorID"     BIGINT NOT NULL REFERENCES users("UserID"),
  "AssigneeID"      BIGINT NOT NULL REFERENCES users("UserID"),
  "ApproverID"      BIGINT REFERENCES users("UserID"),
  "CreatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "UpdatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "Archived"        BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_requests_requestor ON requests ("RequestorID");
CREATE INDEX idx_requests_assignee  ON requests ("AssigneeID");
CREATE INDEX idx_requests_approver  ON requests ("ApproverID");

CREATE TRIGGER trg_requests_updated
BEFORE UPDATE ON requests
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ===========================================================
-- REQUEST AUDIT
-- ===========================================================

CREATE TABLE request_audit (
  "RequestAuditID"  BIGSERIAL PRIMARY KEY,
  "RequestID"       BIGINT NOT NULL REFERENCES requests("RequestID") ON DELETE CASCADE,
  "Status"          request_status,
  "UserID"          BIGINT NOT NULL REFERENCES users("UserID"),
  "Comment"         TEXT,
  "CreatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_request_audit_request ON request_audit ("RequestID");
CREATE INDEX idx_request_audit_user    ON request_audit ("UserID");
