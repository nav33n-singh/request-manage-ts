export enum StatusCodes {
  // success
  OK = 200,
  CREATED = 201,

  // client errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,

  // validation error
  VALIDATION_ERROR = 422,

  // server errors
  INTERNAL_SERVER_ERROR = 500,
}

export enum StatusMessages {
  OK = "Success",
  CREATED = "Created successfully",
  VALIDATION_ERROR = "Validation failed",
  BAD_REQUEST = "Bad request",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "Resource not found",
  INTERNAL_SERVER_ERROR = "Internal server error"
}
