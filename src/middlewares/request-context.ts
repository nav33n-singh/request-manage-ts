import { NextFunction, Request, Response } from "express";
import { AsyncContext, RequestContext } from "../utils/async-context";
import { v4 } from 'uuid';

export const requestContext = async (_request: Request, _response: Response, next: NextFunction) => {
  const context: RequestContext = {
    requestId: v4(),
    user: null
  }
  AsyncContext.run(context, () => next());
}
