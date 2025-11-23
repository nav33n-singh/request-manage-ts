import { Router } from "express";
import { authenticationRouter } from './authentication-route';
import { requestRouter } from "./request-route";

const rootRouter = Router();

rootRouter.use('/auth', authenticationRouter);
rootRouter.use('/request', requestRouter);

export default rootRouter;
