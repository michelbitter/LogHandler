import {Schema} from 'joi'
const joi = require('joi')

export const dependenciesSchema: Schema = joi
  .object()
  .keys({
    Joi: joi.object().required(),
    _: joi.object().required(),
  })
  .required()

export default dependenciesSchema
