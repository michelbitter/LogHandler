"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("../interfaces");
const joi = require('@hapi/joi');
exports.configSchema = joi
    .object()
    .required()
    .keys({
    reporters: joi
        .array()
        .items(joi.object().keys({
        log: joi.func().required(),
        name: joi.string().required(),
        timeOut: joi.number().optional(),
    }))
        .required(),
    reporting: joi
        .object()
        .keys({
        minimalLevel2Report: joi
            .string()
            .valid(interfaces_1.LogLevelsKeys)
            .optional(),
        silent: joi
            .boolean()
            .optional()
            .default(false),
    })
        .optional(),
})
    .required();
exports.default = exports.configSchema;
//# sourceMappingURL=configSchema.js.map