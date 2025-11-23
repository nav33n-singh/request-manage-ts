import { Router } from "express";
import { authenticationRouter } from './authentication-route';

const rootRouter = Router();

rootRouter.use('/auth', authenticationRouter);

export default rootRouter;
