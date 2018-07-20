"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const events = require("events");
const joi = require("joi");
const interfaces_1 = require("./interfaces");
const configSchema_1 = require("./schemas/configSchema");
const dependenciesSchema_1 = require("./schemas/dependenciesSchema");
const logger_1 = require("./logger");
class logHandler {
    constructor(deps, config) {
        this.deps = deps;
        this.config = config;
        if (typeof deps.joi === 'object' &&
            typeof deps.joi.validate === 'function' &&
            deps.joi.validate(deps, dependenciesSchema_1.default)) {
            if (!config)
                throw new Error('LogHandler: Config not available');
            if (deps.joi.validate(config, configSchema_1.default).error) {
                throw new Error('LogHandler: Config not valid');
            }
        }
        else {
            throw new Error('LogHandler: Dependencies are missing or not complete');
        }
    }
    static factory(config) {
        const eventEmitter = new events();
        return new this({
            _,
            joi,
            logger: logger_1.default.factory(config, eventEmitter),
            logEmitter: eventEmitter,
        }, config);
    }
    getLogHandler() {
        const logHandlerobj = {
            emerg: this.logFnc(interfaces_1.LogLevels.emerg),
            alert: this.logFnc(interfaces_1.LogLevels.alert),
            crit: this.logFnc(interfaces_1.LogLevels.crit),
            err: this.logFnc(interfaces_1.LogLevels.err),
            warning: this.logFnc(interfaces_1.LogLevels.warning),
            notice: this.logFnc(interfaces_1.LogLevels.notice),
            info: this.logFnc(interfaces_1.LogLevels.info),
            debug: this.logFnc(interfaces_1.LogLevels.debug),
        };
        return logHandlerobj;
    }
    logFnc(lvl) {
        return (msg, data, ...args) => {
            const logitem = {
                data: typeof data === 'undefined' ? {} : data,
                msg: typeof msg === 'string' ? new Error(msg) : msg,
            };
            const logObject = {
                args,
                createdAt: new Date(),
                data: logitem.data,
                error: logitem.msg,
                level: interfaces_1.LogLevelsKeys.indexOf(lvl),
            };
            this.deps.logEmitter.emit('register', logObject);
            this.deps.logger.call(logObject);
        };
    }
    getEmitter() {
        return this.deps.logEmitter;
    }
}
exports.logHandler = logHandler;
exports.default = logHandler;
//# sourceMappingURL=logHandler.js.map