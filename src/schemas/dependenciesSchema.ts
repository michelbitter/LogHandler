import {Schema} from '@hapi/joi'
const joi = require('@hapi/joi')

export const dependenciesSchema: Schema = joi
  .object()
  .keys({
    Joi: joi.object().required(),
    _: joi.object().required(),
  })
  .required()

export default dependenciesSchema
