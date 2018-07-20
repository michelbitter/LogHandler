import * as _ from 'lodash'
import * as events from 'events'
import * as joi from 'joi'
import {Config, LogObjectInterface, Dependencies, LogLevelsKeys} from './interfaces'
import configSchema from './schemas/configSchema'
import dependenciesSchema from './schemas/dependenciesSchema'

export class Logger {
  private readonly TIMEOUT = Symbol('TIMEOUT')

  public static factory(config, eventEmitter = new events()) {
    return new this(
      {
        _,
        joi,
        logEmitter: eventEmitter,
      },
      config,
    )
  }

  constructor(private deps: Dependencies, private config: Config) {
    if (
      typeof deps.joi === 'object' &&
      typeof deps.joi.validate === 'function' &&
      deps.joi.validate(deps, dependenciesSchema).error
    ) {
      if (!config) {
        throw new Error('LogHandler.Logger: Config not available')
      }
      if (deps.joi.validate(config, configSchema).error) {
        throw new Error('LogHandler.Logger: Config not valid')
      }
    } else {
      throw new Error('LogHandler.Logger: Dependencies are missing or not complete')
    }
  }

  public call(log: LogObjectInterface) {
    if (
      (!this.config.reporting || !this.config.reporting.silent) &&
      (!this.config.reporting ||
        !this.config.reporting.minimalLevel2Report ||
        log.level <= LogLevelsKeys.indexOf(this.config.reporting.minimalLevel2Report))
    ) {
      this.deps.logEmitter.emit('log', log)

      const activeReportesList: Promise<void>[] = []
      this.config.reporters.forEach((reporter, index) => {
        activeReportesList.push(this.report(log, index))
      })

      Promise.all(activeReportesList)
    }
  }

  private async timer(timeout: number) {
    return new Promise(res => {
      setTimeout(() => {
        res(this.TIMEOUT)
      }, timeout)
    })
  }

  private async report(log: LogObjectInterface, reporterIndex: number) {
    const reporter = this.config.reporters[reporterIndex]
    const timeout = typeof reporter.timeOut === 'number' ? reporter.timeOut : 2500
    try {
      const race = await Promise.race([reporter.log(log), this.timer(timeout)])
      if (typeof race === 'symbol' && race === this.TIMEOUT) {
        // Reporter THROWS ERROR
        const reporterError: LogObjectInterface = {
          args: [],
          createdAt: new Date(),
          data: {
            error: log.error,
            timeoutTime: timeout,
          },
          error: new Error(
            `REPORTER TIMEOUT: Reporter "${reporter.name}" didn't response within "${timeout}" miliseconds.`,
          ),
          level: LogLevelsKeys.indexOf('warning'),
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
        level: LogLevelsKeys.indexOf('err'),
      }
      await this.logOnNewInstance(reporterError, reporterIndex)
    }

    return
  }

  private async logOnNewInstance(log: LogObjectInterface, reporterWithProblemsIndex: number) {
    const newConfig = this.deps._.cloneDeep(this.config)
    newConfig.reporters.splice(reporterWithProblemsIndex, 1)
    const self = new Logger(this.deps, newConfig)
    self.call(log)
    return
  }
}

export default Logger
