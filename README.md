# Request Manager Backend

A TypeScript/Express.js backend application for managing requests with a workflow system. The system supports three user roles: Requestor, Manager, and Assignee.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Request Management**: Create, approve, reject, and close requests
- **Role-based Workflows**: 
  - Requestors create requests
  - Managers approve/reject requests
  - Assignees work on and close approved requests
- **Request Queues**: Separate queues for requestors, managers, and assignees
- **Audit Trail**: Complete audit history for all request status changes
- **CORS Enabled**: Configured to allow all origins for frontend integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: PostgreSQL with Knex.js query builder
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js (v20 or higher recommended)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd request-manager-ts
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-secret-key-here
PORT=4001
```

4. Set up the database:
   - Create a PostgreSQL database
   - Run the migration script:
   ```bash
   psql -U username -d database_name -f migrations/DDL.sql
   ```
   - (Optional) Run seed data:
   ```bash
   psql -U username -d database_name -f migrations/SEED.sql
   ```

## Running the Project

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:4001` (or the port specified in your `.env` file).

### Production Mode
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## API Endpoints

### Base URL
All endpoints are prefixed with `/api/v1`

### Authentication
- `POST /api/v1/auth/user/authenticate` - Authenticate user and receive JWT token

### Request Management
- `POST /api/v1/request/create` - Create a new request
- `POST /api/v1/request/approve` - Approve or reject a request (Manager only)
- `POST /api/v1/request/close` - Close an approved request (Assignee only)
- `POST /api/v1/request/mine` - Get current user's requests (paginated)
- `POST /api/v1/request/managerQueue` - Get manager's approval queue (paginated)
- `POST /api/v1/request/assigneeQueue` - Get assignee's work queue (paginated)
- `GET /api/v1/request/assignees` - Get all active assignees

### Authentication
Most endpoints require a JWT token in the `Authorization` header:
```
Authorization: <your-jwt-token>
```

## Project Structure

```
request-manager-ts/
├── migrations/           # Database migration scripts
│   ├── DDL.sql          # Database schema
│   └── SEED.sql         # Seed data (optional)
├── src/
│   ├── config.ts        # Configuration settings
│   ├── databases.ts     # Database connection setup
│   ├── index.ts         # Express app setup and server
│   ├── constants/       # Application constants
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Express middlewares (auth, error handling)
│   ├── repositories/    # Data access layer
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── validators/      # Request validation schemas
├── index.ts             # Application entry point
├── package.json
└── tsconfig.json
```

## Request Workflow

1. **Request Creation**: Requestor creates a request → Status: `PendingApproval`
2. **Manager Approval**: Manager approves/rejects → Status: `Approved` or `Rejected`
3. **Assignee Closure**: Assignee closes approved request → Status: `Closed`

### Workflow Rules
- Only managers can approve/reject requests in `PendingApproval` status
- Only assignees can close requests in `Approved` status
- All status changes are automatically audited

## Database Schema

### Tables
- **users**: User accounts and profiles
- **assignee_manager_mappings**: Mapping between assignees and their managers
- **requests**: Request records with status tracking
- **request_audit**: Audit trail for all request status changes

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `PORT` | Server port number | No (defaults to 4001) |

## Response Format

All API responses follow this standard format:

**Success:**
```json
{
  "success": true,
  "message": "Success",
  "data": { /* endpoint-specific data */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

## HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request (business logic error)
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Validation Error` - Request validation failed
- `500 Internal Server Error` - Server error

## License

ISC

