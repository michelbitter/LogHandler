import {LogHandler as LogHandlerClass} from './logHandler'
import {
  Config as config,
  ReportersInterface as reportersInterface,
  LogObjectInterface as logObjectInterface,
  LogLevels as logLevels,
  LogLevelsKeys as LogLevelsKeysList,
  LogHandlerResults,
} from './interfaces'

const logHandler = function(config: Config) {
  return LogHandlerClass.factory(config).getLogHandler()
}

export default logHandler
export type ReportersInterface = reportersInterface
export type Config = config
export type LogObjectInterface = logObjectInterface
export type LogLevels = logLevels
export type Log = LogHandlerResults
export const logLevelsKeys = LogLevelsKeysList
