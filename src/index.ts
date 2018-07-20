import {logHandler as LogHandlerClass} from './logHandler'
import {Config} from './interfaces'
const logHandler = function(config: Config) {
  return LogHandlerClass.factory(config).getLogHandler()
}

export default logHandler
