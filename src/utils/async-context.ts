import { AsyncLocalStorage } from "node:async_hooks";
import { AuthenticatedUser } from "../types/states/user";
import { AppError } from "./app-error";
import { StatusCodes, StatusMessages } from "../types/common/status-codes";

export interface RequestContext {
  requestId: string;
  user: AuthenticatedUser | null;
}

export class AsyncContext {
  private static asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  static run<T>(context: RequestContext, callback: () => T): T {
    return this.asyncLocalStorage.run(context, callback);
  }

  static getStore(): RequestContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  static getRequiredStore(): RequestContext {
    const store = this.asyncLocalStorage.getStore();
    if (!store) {
      console.log('AsyncLocalStorage store not available')
      throw new AppError(StatusMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return store;
  }

  static setAuthUser(user: AuthenticatedUser) {
    const store = this.getStore();
    if (!store) {
      console.error("AsyncContext.setUser: store not available");
      throw new AppError(StatusMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    store.user = user;
  }

  static getAuthUser(): AuthenticatedUser | null {
    return this.getStore()?.user ?? null;
  }
}