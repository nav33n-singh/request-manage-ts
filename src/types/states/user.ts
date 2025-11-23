export interface AuthenticatedUser {
  id: number;
  email: string;
  userName: string;
  role: string | null;
  mobileNo: string | null;
  phoneCode: string | null;
}

export interface AuthenticateUserCommand {
  userName: string;
  password: string;
}

export interface User {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  userName: string;
  email: string;
  mobileNo: string | null;
  phoneCode: string | null;
}
