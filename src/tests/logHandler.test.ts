import * as chai from 'chai'
import * as faker from 'faker'
import * as joi from 'joi'
import * as _ from 'lodash'
import * as events from 'events'
import logHandler from '../logHandler'
import {Config, LogLevels, LogLevelsKeys, LogHandlerDependencies, LogObjectInterface} from '../interfaces'
import logger from './testFiles/logger'
import {Logger} from '../logger'

const assert = chai.assert
suite('Test logHandler Functionality', () => {
  let deps: LogHandlerDependencies = {
    _,
    joi,
    logger: new logger.instance() as Logger,
    logEmitter: new events(),
  }

  beforeEach(() => {
    deps = {
      _,
      joi,
      logger: new logger.instance() as Logger,
      logEmitter: new events(),
    }
  })

  suite('Test factory()', () => {
    test('rerturns instance of logHandler', () => {
      const loghandlerClass = logHandler.factory({reporters: []})
      assert.instanceOf(loghandlerClass, logHandler)
    })
  })

  suite('Test Constructor()', () => {
    test('throws Error when Config is undefined', () => {
      assert.throws(() => new logHandler(deps, undefined as any), 'LogHandler: Config not available')
    })

    test('throws Error when Config is not valid', () => {
      assert.throws(
        () => new logHandler(deps, {doSomething: faker.lorem.slug()} as any),
        'LogHandler: Config not valid',
      )
    })

    test('throws error when dependencies are missing', () => {
      assert.throws(
        () => new logHandler({} as any, {reporters: []}),
        'LogHandler: Dependencies are missing or not complete',
      )
    })
  })

  suite('Test getEmitter()', () => {
    test('returns instanceof Events', () => {
      const config: Config = {reporters: []}
      const logHandlerClass = logHandler.factory(config)
      const emitter = logHandlerClass.getEmitter()
      assert.instanceOf(emitter, events)
    })
  })

  suite('Test getLogHandler()', () => {
    const config: Config = {reporters: []}
    const logLevels: LogLevels[] = ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug']

    let logHandlerClass = logHandler.factory(config)
    let eventEmitter = logHandlerClass.getEmitter()

    beforeEach(() => {
      logHandlerClass = new logHandler(deps, config)
      eventEmitter = logHandlerClass.getEmitter()
    })

    afterEach(() => {
      logger.reset()
      eventEmitter.removeAllListeners()
    })

    test('Make sure all logLevels have an report function', () => {
      const output = logHandlerClass.getLogHandler()
      logLevels.forEach(lvl => {
        assert.exists(output[lvl])
        assert.isFunction(output[lvl])
      })
    })

    test('report functions can handle errors', () => {
      const reportFunctionSchema = joi.func().minArity(1)
      const output = logHandlerClass.getLogHandler()

      logLevels.forEach(lvl => {
        joi.assert(output[lvl], reportFunctionSchema)
        const before = logger.mocks.call.callCount
        output[lvl](new Error(faker.lorem.sentence()))
        assert.isTrue(before + 1 === logger.mocks.call.callCount)
      })
    })

    test('report functions generates errorObj as expected', () => {
      const reportFunctionSchema = joi.func().minArity(1)
      const output = logHandlerClass.getLogHandler()

      logLevels.forEach(lvl => {
        const count = logger.mocks.call.callCount

        const errorMsg = new Error(faker.lorem.sentence())
        const data = faker.lorem.paragraph()
        const arg1 = faker.lorem.slug()
        const arg2 = faker.lorem.slug()

        output[lvl](errorMsg, {testData: data}, arg1, {test: arg2})
        const errorObj = logger.mocks.call.args[count][0][0]
        const errorObjSchema = joi.object({
          args: joi
            .array()
            .items(joi.alternatives().try([joi.string().valid([arg1]), joi.object({test: joi.string().valid(arg2)})]))
            .length(2),
          createdAt: joi.date(),
          data: joi.object({
            testData: joi.valid(data),
          }),
          error: joi.object({
            msg: joi.valid(errorMsg.message),
            name: joi.valid(errorMsg.name),
            stack: joi.valid(errorMsg.stack).optional(),
          }),
          level: joi.valid(LogLevelsKeys.indexOf(lvl)),
        })
        joi.assert(errorObj, errorObjSchema)
      })
    })

    test('report function accepts Error and string input', () => {
      const reportFunctionSchema = joi.func().minArity(1)
      const output = logHandlerClass.getLogHandler()

      logLevels.forEach(lvl => {
        joi.assert(output[lvl], reportFunctionSchema)
        const before = logger.mocks.call.callCount
        output[lvl](new Error(faker.lorem.sentence()))
        output[lvl](faker.lorem.sentence())
        assert.isTrue(before + 2 === logger.mocks.call.callCount)
      })
    })

    test('Log reports are correctly registered in LogEmitter', done => {
      const log = logHandlerClass.getLogHandler()
      const errorMsg = new Error(faker.lorem.slug())
      const data = faker.lorem.slug()
      const arg1 = faker.lorem.slug()
      const arg2 = faker.lorem.slug()
      const errorObjSchema = joi.object({
        args: joi
          .array()
          .items(joi.alternatives().try([joi.string().valid([arg1]), joi.object({test: joi.string().valid(arg2)})]))
          .length(2),
        createdAt: joi.date(),
        data: joi.object({
          testData: joi.valid(data),
        }),
        error: joi.object({
          msg: joi.valid(errorMsg.message),
          name: joi.valid(errorMsg.name),
          stack: joi.valid(errorMsg.stack).optional(),
        }),
        level: joi.valid(LogLevelsKeys.indexOf(LogLevels.alert)),
      })

      eventEmitter.on('register', (logData: LogObjectInterface) => {
        joi.assert(logData, errorObjSchema)
        done()
      })

      log.alert(errorMsg, {testData: data}, arg1, {test: arg2})
    })
  })
})
