"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const events = require("events");
const joi = require("joi");
const interfaces_1 = require("./interfaces");
const configSchema_1 = require("./schemas/configSchema");
const dependenciesSchema_1 = require("./schemas/dependenciesSchema");
class Logger {
    constructor(deps, config) {
        this.deps = deps;
        this.config = config;
        this.TIMEOUT = Symbol('TIMEOUT');
        if (typeof deps.joi === 'object' &&
            typeof deps.joi.validate === 'function' &&
            deps.joi.validate(deps, dependenciesSchema_1.default).error) {
            if (!config) {
                throw new Error('LogHandler.Logger: Config not available');
            }
            if (deps.joi.validate(config, configSchema_1.default).error) {
                throw new Error('LogHandler.Logger: Config not valid');
            }
        }
        else {
            throw new Error('LogHandler.Logger: Dependencies are missing or not complete');
        }
    }
    static factory(config, eventEmitter = new events()) {
        return new this({
            _,
            joi,
            logEmitter: eventEmitter,
        }, config);
    }
    call(log) {
        if ((!this.config.reporting || !this.config.reporting.silent) &&
            (!this.config.reporting ||
                !this.config.reporting.minimalLevel2Report ||
                log.level <= interfaces_1.LogLevelsKeys.indexOf(this.config.reporting.minimalLevel2Report))) {
            this.deps.logEmitter.emit('log', log);
            const activeReportesList = [];
            this.config.reporters.forEach((reporter, index) => {
                activeReportesList.push(this.report(log, index));
            });
            Promise.all(activeReportesList);
        }
    }
    async timer(timeout) {
        return new Promise(res => {
            setTimeout(() => {
                res(this.TIMEOUT);
            }, timeout);
        });
    }
    async report(log, reporterIndex) {
        const reporter = this.config.reporters[reporterIndex];
        const timeout = typeof reporter.timeOut === 'number' ? reporter.timeOut : 2500;
        try {
            const race = await Promise.race([reporter.log(log), this.timer(timeout)]);
            if (typeof race === 'symbol' && race === this.TIMEOUT) {
                const reporterError = {
                    args: [],
                    createdAt: new Date(),
                    data: {
                        error: log.error,
                        timeoutTime: timeout,
                    },
                    error: new Error(`REPORTER TIMEOUT: Reporter "${reporter.name}" didn't response within "${timeout}" miliseconds.`),
                    level: interfaces_1.LogLevelsKeys.indexOf('warning'),
                };
                await this.logOnNewInstance(reporterError, reporterIndex);
            }
        }
        catch (err) {
            const reporterError = {
                args: [],
                createdAt: new Date(),
                data: {
                    error: err,
                },
                error: new Error(`Reporter "${reporter.name}", rejected report promise`),
                level: interfaces_1.LogLevelsKeys.indexOf('err'),
            };
            await this.logOnNewInstance(reporterError, reporterIndex);
        }
        return;
    }
    async logOnNewInstance(log, reporterWithProblemsIndex) {
        const newConfig = this.deps._.cloneDeep(this.config);
        newConfig.reporters.splice(reporterWithProblemsIndex, 1);
        const self = new Logger(this.deps, newConfig);
        self.call(log);
        return;
    }
}
exports.Logger = Logger;
exports.default = Logger;
//# sourceMappingURL=logger.js.map