import { Router } from "express";
import { RequestController } from "../controllers/RequestController";
import { validator } from "../utils/validator";
import { createRequestSchema, approveRejectRequestSchema, closeRequestSchema } from "../validators/request-validator";
import { commonPaginationRequest } from "../validators/common-validator";

export const requestRouter = Router();
const requestController = new RequestController();

requestRouter.post("/create", validator(createRequestSchema), requestController.createRequest);
requestRouter.post("/approve", validator(approveRejectRequestSchema), requestController.approveRejectRequest);
requestRouter.post("/close", validator(closeRequestSchema), requestController.closeRequest);

requestRouter.get("/mine", validator(commonPaginationRequest), requestController.getCurrentUserRequests);
requestRouter.get("/queue", validator(commonPaginationRequest), requestController.getQueuedRequests);

