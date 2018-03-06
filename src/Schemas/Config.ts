import {Schema} from 'joi'
const joi = require('joi')

const ConfigSchema: Schema = joi
  .object()
  .required()
  .keys({
    reporters: joi
      .array()
      .items(
        joi.object().keys({
          log: joi.func().required(),
          name: joi.string().required(),
          timeOut: joi.number().optional(),
        }),
      )
      .required(),
    reporting: joi
      .object()
      .keys({
        minimalLevel2Report: joi
          .number()
          .integer()
          .min(0)
          .max(7)
          .optional(),
        silent: joi
          .boolean()
          .optional()
          .default(false),
      })
      .optional(),
  })
  .required()

module.exports = ConfigSchema
