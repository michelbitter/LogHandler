"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigSchema = require('./Schemas/Config');
const DependenciesSchema = require('./Schemas/Dependencies');
const Logger = class {
    constructor(Dependencies, Config) {
        this.Dependencies = Dependencies;
        this.Config = Config;
        this.LogLevels = ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug'];
        this.TIMEOUT = Symbol('TIMEOUT');
        if (typeof Dependencies.Joi === 'object' && typeof Dependencies.Joi.validate === 'function' &&
            Dependencies.Joi.validate(Dependencies, DependenciesSchema)) {
            if (!Config)
                throw new Error('ApiStart.Logger: Config not available');
            if (Dependencies.Joi.validate(Config, ConfigSchema).error)
                throw new Error('ApiStart.Logger: Config not valid');
        }
        else {
            throw new Error('ApiStart.Logger: Dependencies are missing or not complete');
        }
    }
    Call(LogObject) {
        this.Config.reporting = (typeof this.Config.reporting === 'undefined') ? {} : this.Config.reporting;
        this.Config.reporting.silent = (typeof this.Config.reporting.silent === 'undefined') ? false : this.Config.reporting.silent;
        this.Config.reporting.minimalLevel2Report = (typeof this.Config.reporting.minimalLevel2Report === 'undefined') ? this.LogLevels.indexOf('debug') : this.Config.reporting.minimalLevel2Report;
        if (!this.Config.reporting.silent && LogObject.level <= this.Config.reporting.minimalLevel2Report) {
            this.Dependencies.LogEmitter.emit('log', LogObject);
            const activeReportesList = [];
            this.Config.reporters.forEach((reporter, index) => {
                activeReportesList.push(this.report(LogObject, index));
            });
            Promise.all(activeReportesList);
        }
    }
    async report(LogObject, reporterIndex) {
        const reporter = this.Config.reporters[reporterIndex];
        const timeout = (typeof reporter.TimeOut === 'number') ? reporter.TimeOut : 2500;
        try {
            const race = await Promise.race([reporter.Log(LogObject), this.timer(timeout)]);
            if (typeof race === 'symbol' && race === this.TIMEOUT) {
                const reporterError = {
                    args: [],
                    createdAt: new Date(),
                    data: {
                        error: LogObject.error,
                        timeoutTime: timeout,
                    },
                    error: new Error(`REPORTER TIMEOUT: Reporter "${reporter.Name}" didn't response within "${timeout}" miliseconds. `),
                    level: this.LogLevels.indexOf('warning'),
                };
                await this.LogOnNewInstance(reporterError, reporterIndex);
            }
        }
        catch (err) {
            const reporterError = {
                args: [],
                createdAt: new Date(),
                data: {
                    error: err,
                },
                error: new Error(`Reporter "${reporter.Name}", rejected report promise`),
                level: this.LogLevels.indexOf('err'),
            };
            await this.LogOnNewInstance(reporterError, reporterIndex);
        }
        return;
    }
    timer(timeout) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(this.TIMEOUT);
            }, timeout);
        });
    }
    async LogOnNewInstance(LogObject, ReporterWithProblemsIndex) {
        const newConfig = this.Dependencies._.cloneDeep(this.Config);
        newConfig.reporters.splice(ReporterWithProblemsIndex, 1);
        const self = new Logger(this.Dependencies, newConfig);
        self.Call(LogObject);
        return;
    }
};
module.exports = Logger;
//# sourceMappingURL=Logger.js.map