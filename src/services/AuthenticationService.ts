import { JWT_EXPIRY, JWT_SECRET } from "../config";
import { AuthenticatedUser, AuthenticateUserCommand, User } from "../types/states/user";
import jwt from 'jsonwebtoken';
import { AppError } from "../utils/app-error";
import { StatusCodes, StatusMessages } from "../types/common/status-codes";
import { IAppAuthenticationService } from "./interfaces";
import { ResponseBoolean } from "../types/common/response";
import { UserRepository } from "../repositories/UserRepository";
import { compare } from 'bcrypt';

export class AuthenticationService implements IAppAuthenticationService {
  private static _instance: AuthenticationService;
  private constructor() { }

  async findUserByUserName(userName: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService._instance) {
      AuthenticationService._instance = new AuthenticationService();
    }
    return AuthenticationService._instance;
  }

  public async verifyJsonWebToken(token: string): Promise<AuthenticatedUser> {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload | string;

    if (!decoded || typeof decoded === "string") {
      throw new AppError(StatusMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
    }

    if (!decoded.id) {
      throw new jwt.JsonWebTokenError("Token payload missing userId");
    }
    const authenticatedUser: AuthenticatedUser = {
      id: decoded.id,
      email: decoded.email,
      userName: decoded.userName,
      mobileNo: decoded.mobileNo,
      phoneCode: decoded.phoneCode
    }
    return authenticatedUser;
  }

  async authenticateUser(command: AuthenticateUserCommand): Promise<string> {
    const user = await UserRepository.findByUserName(command.userName);
    const isValidPassword = this.validatePassword(command.password, user.PasswordHash);
    if (!isValidPassword) {
      throw new AppError(StatusMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
    }
    const authenticatedUser: AuthenticatedUser = {
      id: user.UserID,
      userName: user.UserName,
      email: user.Email,
      mobileNo: user.MobileNo || '',
      phoneCode: user.PhoneCode || '',
    }
    const signedJWT = this.signJsonWebToken(authenticatedUser);

    return signedJWT;
  }

  async logoutUser(): Promise<ResponseBoolean> {
    throw new Error("Method not implemented.");
  }

  private signJsonWebToken(user: AuthenticatedUser, expiresIn = JWT_EXPIRY): string {
    const options: jwt.SignOptions = { expiresIn };
    return jwt.sign(user, JWT_SECRET, options);
  }

  private async validatePassword(password: string, passwordHash: string): Promise<boolean> {
    return await compare(password, passwordHash);
  }
}
