"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogConfigSchema = require('./Schemas/Config');
const DependenciesSchema = require('./Schemas/Dependencies');
const Events = require('events');
const LogHandler = function (Dependencies, Config) {
    if (typeof Dependencies.Joi === 'object' &&
        typeof Dependencies.Joi.validate === 'function' &&
        Dependencies.Joi.validate(Dependencies, DependenciesSchema)) {
        if (!Config)
            throw new Error('LogHandler: Config not available');
        if (Dependencies.Joi.validate(Config, LogConfigSchema).error)
            throw new Error('LogHandler: Config not valid');
    }
    else {
        throw new Error('LogHandler: Dependencies are missing or not complete');
    }
    const LogEmitter = new class LogEmitterClass extends Events {
    }();
    const LoggerDependencies = {
        Joi: Dependencies.Joi,
        LogEmitter,
        _: Dependencies._,
    };
    const LoggerClass = new Dependencies.Logger(LoggerDependencies, Config);
    const Logger = {};
    LoggerClass.LogLevels.forEach(prop => {
        Object.defineProperty(Logger, prop, {
            configurable: false,
            enumerable: false,
            get() {
                return function (msg, data, ...args) {
                    data = typeof data === 'undefined' ? {} : data;
                    if (typeof msg === 'string')
                        msg = new Error(msg);
                    const LogObject = {
                        args,
                        createdAt: new Date(),
                        data,
                        error: msg,
                        level: LoggerClass.LogLevels.indexOf(prop),
                    };
                    LogEmitter.emit('register', LogObject);
                    LoggerClass.Call(LogObject);
                };
            },
            set(func) {
                throw new Error(`You're not allowed to override Logging functionality of "${prop}"`);
            },
        });
    });
    Object.defineProperty(Logger, 'emitter', {
        configurable: false,
        enumerable: false,
        get() {
            return function () {
                return LogEmitter;
            };
        },
        set() {
            throw new Error(`You're not allowed to override Logging functionality of "listener"`);
        },
    });
    return Logger;
};
module.exports = LogHandler;
//# sourceMappingURL=LoggingHandler.js.map