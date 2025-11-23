import { StatusCodes, StatusMessages } from "../types/common/status-codes";
import { UserRow } from "../types/dtos/users";
import { AppError } from "../utils/app-error";
import { Database } from "../databases";

export class UserRepository {
  static async findByUserName(userName: string): Promise<UserRow> {
    const pg = Database.getInstance().pgClient;
    const queryParams = {
      UserName: userName,
      IsActive: true,
    }
    const queryResult = await pg('users').first().where(queryParams);
    if (!queryResult) {
      throw new AppError(StatusMessages.NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return queryResult;
  }
}
