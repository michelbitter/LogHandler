"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require('@hapi/joi');
exports.dependenciesSchema = joi
    .object()
    .keys({
    Joi: joi.object().required(),
    _: joi.object().required(),
})
    .required();
exports.default = exports.dependenciesSchema;
//# sourceMappingURL=dependenciesSchema.js.map