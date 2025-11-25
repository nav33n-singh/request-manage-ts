import { IRequestService } from "../types/services/IRequestService";
import { IUserAuthService } from "../types/services/IUserAuthService";
import { AuthenticatedUser, User } from "../types/states/user";

export interface IAppAuthenticationService extends IUserAuthService {
  verifyJsonWebToken(token: string): Promise<AuthenticatedUser>;
  findUserByUserName(userName: string): Promise<User>;
}

export interface IAppRequestService extends IRequestService { }