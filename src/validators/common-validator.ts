import Joi from "joi";

export const commonPaginationRequest = Joi.object({
  page: Joi.number().required(),
  count: Joi.number().required()
})