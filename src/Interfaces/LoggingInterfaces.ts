import {EventEmitter} from 'events'
import {Joi} from 'joi'
import {LoDashStatic} from 'lodash'

export enum LogLevels {
  'emerg',
  'alert',
  'crit',
  'err',
  'warning',
  'notice',
  'info',
  'debug',
}

export interface LoggerClass {
  new (dependencies: LoggerDependencies, config: {}): LoggerInterface
}

export interface LoggerDependencies {
  Joi: Joi
  LogEmitter: EventEmitter
  _: LoDashStatic
}

export interface LoggingDependencies {
  Joi: Joi
  Logger: LoggerClass
  _: LoDashStatic
}

export type LoggerInstance = (msg: string | Error, data?: {[key: string]: any}, ...args: any[]) => void // tslint:disable-line:no-any

export type LoggingHandlerInterface = (Dependecies: LoggingDependencies, Config: LoggingConfig) => LoggingHandlerResults

export interface LoggingHandlerResults {
  emerg: LoggerInstance
  alert: LoggerInstance
  crit: LoggerInstance
  error: LoggerInstance
  warning: LoggerInstance
  notice: LoggerInstance
  info: LoggerInstance
  debug: LoggerInstance
  emitter(): EventEmitter
}

export interface LoggerInterface {
  LogLevels: string[]
  call(LogObject: LogObjectInterface): void
}

export interface ReportersInterface {
  name: string
  timeOut?: number
  log(LogObject: LogObjectInterface): Promise<void>
}

export interface ReportersClasss {
  new (Options: {[key: string]: any}): ReportersInterface // tslint:disable-line:no-any
}

export interface LogObjectInterface {
  level: LogLevels
  error: Error
  data: {[key: string]: any} // tslint:disable-line:no-any
  args: any[] // tslint:disable-line:no-any
  createdAt: Date
}

export interface LoggingConfig {
  reporters: ReportersInterface[]
  reporting?: {
    silent?: boolean
    minimalLevel2Report?: LogLevels
  }
}

export type LogHandlerInterface = (Config: LoggingConfig) => LoggingHandlerResults
