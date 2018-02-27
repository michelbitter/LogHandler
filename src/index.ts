import * as _ from 'lodash'
import { LogHandlerInterface, LoggingDependencies } from './Interfaces/LoggingInterfaces'

const LogHandler: LogHandlerInterface = function(Config) {
  return require('./LoggingHandler')(
    {
      Joi: require('joi'),
      Logger: require('./Logger'),
      _: require('lodash'),
    },
    Config,
  )
}
