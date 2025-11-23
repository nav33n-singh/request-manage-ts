export interface AuthenticatedUser {
  id: number;
  email: string;
  userName: string;
  mobileNo: string | null;
  phoneCode: string | null;
}

export interface AuthenticateUserCommand {
  userName: string;
  password: string;
}

export interface UserMeta {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  email: string;
}

export interface User extends UserMeta {
  userName: string;
  mobileNo: string | null;
  phoneCode: string | null;
}

