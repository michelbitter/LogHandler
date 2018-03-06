import {
  LoggerClass,
  LoggerDependencies,
  LoggerInterface,
  LoggingConfig,
  LogObjectInterface,
  ReportersInterface,
} from './Interfaces/LoggingInterfaces'

const ConfigSchema = require('./Schemas/Config')
const DependenciesSchema = require('./Schemas/Dependencies')

const Logger: LoggerClass = class implements LoggerInterface {
  public readonly LogLevels = ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug']
  private readonly TIMEOUT = Symbol('TIMEOUT')

  constructor(private Dependencies: LoggerDependencies, private Config: LoggingConfig) {
    if (
      typeof Dependencies.Joi === 'object' &&
      typeof Dependencies.Joi.validate === 'function' &&
      Dependencies.Joi.validate(Dependencies, DependenciesSchema).error
    ) {
      if (!Config) {
        throw new Error('LogHandler.Logger: Config not available')
      }
      if (Dependencies.Joi.validate(Config, ConfigSchema).error) {
        throw new Error('LogHandler.Logger: Config not valid')
      }
    } else {
      throw new Error('LogHandler.Logger: Dependencies are missing or not complete')
    }
  }

  public call(LogObject: LogObjectInterface) {
    this.Config.reporting = typeof this.Config.reporting === 'undefined' ? {} : this.Config.reporting
    this.Config.reporting.silent =
      typeof this.Config.reporting.silent === 'undefined' ? false : this.Config.reporting.silent
    this.Config.reporting.minimalLevel2Report =
      typeof this.Config.reporting.minimalLevel2Report === 'undefined'
        ? this.LogLevels.indexOf('debug')
        : this.Config.reporting.minimalLevel2Report

    if (!this.Config.reporting.silent && LogObject.level <= this.Config.reporting.minimalLevel2Report) {
      this.Dependencies.LogEmitter.emit('log', LogObject)

      const activeReportesList: Promise<void>[] = []
      this.Config.reporters.forEach((reporter, index) => {
        activeReportesList.push(this.report(LogObject, index))
      })

      Promise.all(activeReportesList)
    }
  }

  private async report(LogObject: LogObjectInterface, reporterIndex: number) {
    const reporter = this.Config.reporters[reporterIndex]
    const timeout = typeof reporter.timeOut === 'number' ? reporter.timeOut : 2500
    try {
      const race = await Promise.race([reporter.log(LogObject), this.timer(timeout)])
      if (typeof race === 'symbol' && race === this.TIMEOUT) {
        // Reporter THROWS ERROR
        const reporterError: LogObjectInterface = {
          args: [],
          createdAt: new Date(),
          data: {
            error: LogObject.error,
            timeoutTime: timeout,
          },
          error: new Error(
            `REPORTER TIMEOUT: Reporter "${reporter.name}" didn't response within "${timeout}" miliseconds. `,
          ),
          level: this.LogLevels.indexOf('warning'),
        }

        await this.logOnNewInstance(reporterError, reporterIndex)
      }
    } catch (err) {
      // Reporter THROWS ERROR
      const reporterError: LogObjectInterface = {
        args: [],
        createdAt: new Date(),
        data: {
          error: err,
        },
        error: new Error(`Reporter "${reporter.name}", rejected report promise`),
        level: this.LogLevels.indexOf('err'),
      }
      await this.logOnNewInstance(reporterError, reporterIndex)
    }

    return
  }

  private timer(timeout: number) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(this.TIMEOUT)
      }, timeout)
    })
  }

  private async logOnNewInstance(LogObject: LogObjectInterface, ReporterWithProblemsIndex: number) {
    const newConfig = this.Dependencies._.cloneDeep(this.Config)
    newConfig.reporters.splice(ReporterWithProblemsIndex, 1)
    const self = new Logger(this.Dependencies, newConfig)
    self.call(LogObject)
    return
  }
}

module.exports = Logger
