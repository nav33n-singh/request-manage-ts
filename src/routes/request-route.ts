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

requestRouter.post("/mine", validator(commonPaginationRequest), requestController.getCurrentUserRequests);
requestRouter.post("/managerQueue", validator(commonPaginationRequest), requestController.getManagerQueue);
requestRouter.post("/assigneeQueue", validator(commonPaginationRequest), requestController.getAssigneeQueue);
requestRouter.get("/assignees", requestController.getAllAssignees);

