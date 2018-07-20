import {Schema} from 'joi'
import {LogLevelsKeys} from '../interfaces'
const joi = require('joi')

export const configSchema: Schema = joi
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
          .string()
          .valid(LogLevelsKeys)
          .optional(),
        silent: joi
          .boolean()
          .optional()
          .default(false),
      })
      .optional(),
  })
  .required()

export default configSchema
