import {logHandler as LogHandlerClass} from './logHandler'
import {
  Config,
  ReportersInterface,
  LogObjectInterface,
  LogLevels,
  LogLevelsKeys as LogLevelsKeysList,
  LogHandlerResults,
} from './interfaces'

const logHandler = function(config: Config) {
  return LogHandlerClass.factory(config).getLogHandler()
}

export default logHandler
export type ReportersInterface = ReportersInterface
export type Config = Config
export type LogObjectInterface = LogObjectInterface
export type LogLevels = LogLevels
export type Results = LogHandlerResults
export const logLevelsKeys = LogLevelsKeysList
