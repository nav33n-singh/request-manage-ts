import Joi from "joi"

export const authenticationValidator = (schemaName: string): Joi.ObjectSchema => {
  switch (schemaName) {
    case 'authenticateUser':
      return Joi.object({
        userName: Joi.string().trim().required(),
        password: Joi.string().trim().required(),
      })
    default: return Joi.object({})
  }
}
