import { NextFunction, Request, Response } from "express";
import { AsyncContext } from "../utils/async-context";
import { v4 } from 'uuid';
import { RequestContext } from "../types/utils/async-context";

export const requestContext = async (_request: Request, _response: Response, next: NextFunction) => {
  const context: RequestContext = {
    requestId: v4(),
    user: null
  }
  AsyncContext.run(context, () => next());
}
