import {EventEmitter} from 'events'
import {date} from 'joi'
import {
  LoggerDependencies,
  LoggingHandlerInterface,
  LoggingHandlerResults,
  LogObjectInterface,
} from './Interfaces/LoggingInterfaces'

const LogConfigSchema = require('./Schemas/Config')
const DependenciesSchema = require('./Schemas/Dependencies')
const Events: new () => EventEmitter = require('events')

const LogHandler: LoggingHandlerInterface = function(Dependencies, Config) {
  if (
    typeof Dependencies.Joi === 'object' &&
    typeof Dependencies.Joi.validate === 'function' &&
    Dependencies.Joi.validate(Dependencies, DependenciesSchema)
  ) {
    if (!Config) throw new Error('LogHandler: Config not available')
    if (Dependencies.Joi.validate(Config, LogConfigSchema).error) {
      throw new Error('LogHandler: Config not valid')
    }
  } else {
    throw new Error('LogHandler: Dependencies are missing or not complete')
  }

  const LogEmitter = new class LogEmitterClass extends Events {}()
  const LoggerDependencies: LoggerDependencies = {
    LogEmitter,
    Joi: Dependencies.Joi,
    _: Dependencies._,
  }
  const LoggerClass = new Dependencies.Logger(LoggerDependencies, Config)

  const Logger = {} as LoggingHandlerResults
  LoggerClass.LogLevels.forEach(prop => {
    Object.defineProperty(Logger, prop, {
      configurable: false,
      enumerable: false,
      get() {
        return function(msg: Error | string, data?: {[key: string]: any}, ...args: any[]): void {
          const logitem = {
            data: typeof data === 'undefined' ? {} : data,
            msg: typeof msg === 'string' ? new Error(msg) : msg,
          }

          const LogObject: LogObjectInterface = {
            args,
            createdAt: new Date(),
            data: logitem.data,
            error: logitem.msg,
            level: LoggerClass.LogLevels.indexOf(prop),
          }
          LogEmitter.emit('register', LogObject)
          LoggerClass.Call(LogObject)
        }
      },
      set(func) {
        throw new Error(`You're not allowed to override Logging functionality of "${prop}"`)
      },
    })
  })

  Object.defineProperty(Logger, 'emitter', {
    configurable: false,
    enumerable: false,
    get() {
      return function() {
        return LogEmitter
      }
    },
    set() {
      throw new Error(`You're not allowed to override Logging functionality of "listener"`)
    },
  })

  return Logger
}

module.exports = LogHandler
