-- password: Password@123
BEGIN;

-- Clean previous seed
DELETE FROM assignee_manager_mappings 
WHERE "AssigneeID" IN (SELECT "UserID" FROM users WHERE "Email" LIKE 'seed.%@example.com')
    OR "ManagerID" IN (SELECT "UserID" FROM users WHERE "Email" LIKE 'seed.%@example.com');

DELETE FROM users
WHERE "Email" LIKE 'seed.%@example.com';

-- ===========================================================
--  USERS
-- ===========================================================
-- Users created:
--  Manager:    seed.manager@example.com
--  Assignee:  seed.assignee@example.com
--  Employee1: seed.employee1@example.com  (neither assignee nor manager)
--  Employee2: seed.employee2@example.com  (neither assignee nor manager)
--  Requestor: seed.requestor@example.com  (requestor only)

INSERT INTO users (
  "FirstName", "MiddleName", "LastName", "UserName", "Email",
  "PasswordHash", "MobileNo", "PhoneCode",
  "IsActive", "IsBlocked", "Archived"
) VALUES
  -- Manager (single manager)
  ('Seed', NULL, 'Manager', 'seed_manager', 'seed.manager@example.com',
    '$2a$10$W4u3G4ZCkxzgv2Fne5DE5uPID2PYkqgrO5oke0YSDXq1fpFvOHnZq',
    '9000000001', '+91', TRUE, FALSE, FALSE),

  -- Assignee (managed by only one manager)
  ('Seed', NULL, 'Assignee', 'seed_assignee', 'seed.assignee@example.com',
    '$2a$10$W4u3G4ZCkxzgv2Fne5DE5uPID2PYkqgrO5oke0YSDXq1fpFvOHnZq',
    '9000000002', '+91', TRUE, FALSE, FALSE),

  -- Regular employee (neither manager nor assignee)
  ('Seed', NULL, 'EmployeeOne', 'seed_employee1', 'seed.employee1@example.com',
    '$2a$10$W4u3G4ZCkxzgv2Fne5DE5uPID2PYkqgrO5oke0YSDXq1fpFvOHnZq',
    '9000000003', '+91', TRUE, FALSE, FALSE),

  -- Another regular employee
  ('Seed', NULL, 'EmployeeTwo', 'seed_employee2', 'seed.employee2@example.com',
    '$2a$10$W4u3G4ZCkxzgv2Fne5DE5uPID2PYkqgrO5oke0YSDXq1fpFvOHnZq',
    '9000000004', '+91', TRUE, FALSE, FALSE),

  -- Requestor (creates requests, but not an assignee or manager)
  ('Seed', NULL, 'Requestor', 'seed_requestor', 'seed.requestor@example.com',
    '$2a$10$W4u3G4ZCkxzgv2Fne5DE5uPID2PYkqgrO5oke0YSDXq1fpFvOHnZq',
    '9000000005', '+91', TRUE, FALSE, FALSE);

-- ===========================================================
--  ASSIGNEE → MANAGER MAPPING (1-to-1)
-- ===========================================================
-- Assignee = seed.assignee@example.com
-- Manager  = seed.manager@example.com

INSERT INTO assignee_manager_mappings ("AssigneeID", "ManagerID", "IsActive")
SELECT a."UserID", m."UserID", TRUE
FROM users a, users m
WHERE a."Email" = 'seed.assignee@example.com'
  AND m."Email" = 'seed.manager@example.com'
ON CONFLICT ("AssigneeID", "ManagerID") DO NOTHING;

COMMIT;
