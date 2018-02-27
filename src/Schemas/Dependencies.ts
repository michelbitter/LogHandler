import { Schema } from 'joi'
const joi = require('joi')

const DependenciesSchema: Schema = joi
  .object()
  .keys({
    EventEmitter: joi.object().required(),
    Joi: joi.object().required(),
    Logger: joi
      .func()
      .class()
      .required(),
    _: joi.object().required(),
  })
  .required()

module.exports = DependenciesSchema
