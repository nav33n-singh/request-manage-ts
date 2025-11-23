import { AuthenticatedUser } from "../states/user";

export interface RequestContext {
  requestId: string;
  user: AuthenticatedUser | null;
}