import Joi from "joi"

export const authenticateUser = Joi.object({
  userName: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
})