import { StatusCodes, StatusMessages } from "../types/common/status-codes";
import { UserRow } from "../types/dtos/users";
import { AppError } from "../utils/app-error";
import { Database } from "../databases";

export class UserRepository {
  private pg = Database.getInstance().pgClient;
  public async findByUserName(userName: string): Promise<UserRow> {
    const queryParams = {
      UserName: userName,
      IsActive: true,
    }
    const queryResult = await this.pg('users').first().where(queryParams);
    if (!queryResult) {
      throw new AppError(StatusMessages.NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return queryResult;
  }

  public async findByIDs(ids: number[]): Promise<UserRow[]> {
    const queryResult = await this.pg('users').select().whereIn('UserID', ids);
    return queryResult;
  }
}
