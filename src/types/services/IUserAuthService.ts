import { ResponseBoolean } from "../common/response";
import { AuthenticateUserCommand } from "../states/user";

export interface IUserAuthService {
  authenticateUser(command: AuthenticateUserCommand): Promise<string>;
  logoutUser(): Promise<ResponseBoolean>;
}