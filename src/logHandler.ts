import * as _ from 'lodash'
import * as events from 'events'
import * as joi from 'joi'
import {
  LogObjectInterface,
  LogHandlerDependencies,
  Config,
  LogLevelsKeys,
  LogHandlerResults,
  LogLevels,
} from './interfaces'
import configSchema from './schemas/configSchema'
import dependenciesSchema from './schemas/dependenciesSchema'
import logger from './logger'

export class logHandler {
  public static factory(config: Config) {
    const eventEmitter = new events()
    return new this(
      {
        _,
        joi,
        logger: logger.factory(config, eventEmitter),
        logEmitter: eventEmitter,
      },
      config,
    )
  }

  constructor(private deps: LogHandlerDependencies, private config: Config) {
    if (
      typeof deps.joi === 'object' &&
      typeof deps.joi.validate === 'function' &&
      deps.joi.validate(deps, dependenciesSchema)
    ) {
      if (!config) throw new Error('LogHandler: Config not available')
      if (deps.joi.validate(config, configSchema).error) {
        throw new Error('LogHandler: Config not valid')
      }
    } else {
      throw new Error('LogHandler: Dependencies are missing or not complete')
    }
  }

  public getLogHandler(): LogHandlerResults {
    const logHandlerobj: LogHandlerResults = {
      emerg: this.logFnc(LogLevels.emerg),
      alert: this.logFnc(LogLevels.alert),
      crit: this.logFnc(LogLevels.crit),
      err: this.logFnc(LogLevels.err),
      warning: this.logFnc(LogLevels.warning),
      notice: this.logFnc(LogLevels.notice),
      info: this.logFnc(LogLevels.info),
      debug: this.logFnc(LogLevels.debug),
    }

    return logHandlerobj
  }

  private logFnc(lvl: LogLevels) {
    return (msg: Error | string, data?: {[key: string]: any}, ...args: any[]): void => {
      const logitem = {
        data: typeof data === 'undefined' ? {} : data,
        msg: typeof msg === 'string' ? new Error(msg) : msg,
      }

      const logObject: LogObjectInterface = {
        args,
        createdAt: new Date(),
        data: logitem.data,
        error: logitem.msg,
        level: LogLevelsKeys.indexOf(lvl),
      }
      this.deps.logEmitter.emit('register', logObject)
      this.deps.logger.call(logObject)
    }
  }

  public getEmitter() {
    return this.deps.logEmitter
  }
}

export default logHandler
