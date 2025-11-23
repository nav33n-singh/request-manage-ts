import { Router } from 'express';
import { authenticationValidator } from '../validators/authentication-validator';
import { validator } from '../utils/validator';
import { AuthenticationController } from '../controllers/AuthenticationController';

export const authenticationRouter = Router();
const authenticationController = new AuthenticationController();

authenticationRouter.post('/user/authenticate', validator(authenticationValidator('authenticateUser')), authenticationController.authenticateUser);
