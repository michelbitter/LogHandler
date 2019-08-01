import * as events from 'events'
import * as Joi from '@hapi/joi'
import * as lodash from 'lodash'
import {Logger} from './logger'
import {strEnumHelper} from './helpers/strEnumHelper'

export interface Config {
  readonly reporters: ReportersInterface[]
  readonly reporting?: {
    readonly silent?: boolean
    readonly minimalLevel2Report?: LogLevels
  }
}

export interface Dependencies {
  readonly joi: typeof Joi
  readonly logEmitter: events
  readonly _: typeof lodash
}

export interface LogHandlerDependencies extends Dependencies {
  logger: Logger
}

export interface LogObjectInterface {
  readonly level: number
  readonly error: Error
  readonly data: {[key: string]: any} // tslint:disable-line:no-any
  readonly args: any[] // tslint:disable-line:no-any
  readonly createdAt: Date
}

// tslint:disable-next-line:variable-name
export const LogLevels = strEnumHelper(['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug'])
export type LogLevels = keyof typeof LogLevels
// tslint:disable-next-line:variable-name
export const LogLevelsKeys = lodash.values<LogLevels>(LogLevels)

export interface ReportersInterface {
  readonly name: string
  readonly log: (logObject: LogObjectInterface) => Promise<void>
  readonly timeOut?: number
}

export type LoggerInstance = (msg: string | Error, data?: {[key: string]: any}, ...args: any[]) => void // tslint:disable-line:no-any
export type LogHandlerResults = {readonly [key in LogLevels]: LoggerInstance}
