"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require('joi');
const DependenciesSchema = joi
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
    .required();
module.exports = DependenciesSchema;
//# sourceMappingURL=Dependencies.js.map