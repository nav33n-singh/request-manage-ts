import Joi from "joi";

export const createRequestSchema = Joi.object({
  request: Joi.string().min(3).max(2000).required(),
  assigneeId: Joi.number().integer().positive().required()
});

export const approveRejectRequestSchema = Joi.object({
  requestId: Joi.number().integer().positive().required(),
  action: Joi.string().valid("Approved", "Rejected").required(),
  comment: Joi.string().allow(null, "").optional()
});

export const closeRequestSchema = Joi.object({
  requestId: Joi.number().integer().positive().required()
});
