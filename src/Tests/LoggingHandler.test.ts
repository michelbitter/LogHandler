import * as chai from 'chai'
import * as faker from 'faker'
import * as joi from 'joi'
import * as _ from 'lodash'
import * as sinon from 'sinon'

const assert = chai.assert
const expect = chai.expect
const should = chai.should
suite('Test LoggingHandler Functionality', () => {
  let LoggingHandler
  let Config
  let Dependencies
  let Functions
  let ErrorLevels

  const mocks = {
    logger: require('./testFiles/Logger'),
  }

  beforeEach(() => {
    LoggingHandler = require('../LoggingHandler')

    Config = {
      reporters: [],
      reporting: {
        silent: false,
      },
    }

    Dependencies = {
      Joi: require('joi'),
      Logger: mocks.logger.instance,
      _: require('lodash'),
    }
    Functions = ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug']

    ErrorLevels = {
      alert: 1,
      crit: 2,
      debug: 7,
      emerg: 0,
      err: 3,
      info: 6,
      notice: 5,
      warning: 4,
    }
  })

  afterEach(() => {
    mocks.logger.reset()
  })

  test('should throw Error when not all Dependencies are available', () => {
    assert.throws(() => LoggingHandler({}, undefined), 'LogHandler: Dependencies are missing or not complete')
  })

  test("should throw Error when Logging Config isn't avaialble", () => {
    assert.throws(() => LoggingHandler(Dependencies, undefined), 'LogHandler: Config not available')
  })

  test("should throw error when Config isn't valid", () => {
    Config.silent = 'uyfgdjhd'
    assert.throws(() => LoggingHandler(Dependencies, Config), 'LogHandler: Config not valid')
  })

  test('should return an Logger Instance when Config is valid', () => {
    assert.isOk(LoggingHandler(Dependencies, Config))
  })

  suite('Test Emitter functionality', () => {
    let Logger
    let Emitter

    beforeEach(() => {
      Logger = LoggingHandler(Dependencies, Config)
      Emitter = Logger.emitter()
    })

    test('Listner returns an EventEmitter when called', () => {
      assert.instanceOf(Logger.emitter(), require('events'))
    })

    test('Listner throws error when functionality got overwritten', () => {
      assert.throws(
        () => (Logger.emitter = 'test'),
        `You're not allowed to override Logging functionality of "listener"`,
      )
    })
  })

  suite('Test Logger Instances', () => {
    let Logger
    let Emitter

    beforeEach(() => {
      Logger = LoggingHandler(Dependencies, Config)
      Emitter = Logger.emitter()
    })

    test('Logger has all Log Instances as aspected.', () => {
      Functions.forEach(method => {
        assert.include(Object.getOwnPropertyNames(Logger), method)
      })
    })

    test('Logger throws error when functionality got overwritten', () => {
      Functions.forEach(method => {
        assert.throws(
          () => (Logger[method] = 'test'),
          `You're not allowed to override Logging functionality of "${method}"`,
        )
      })
    })

    test('All Log functionality works as aspected', () => {
      const stub = sinon.stub()
      Emitter.on('register', (...args) => {
        stub(args)
      })

      Functions.forEach(method => {
        assert.isUndefined(Logger[method]('test'))
        assert.isTrue(stub.calledOnce, 'No "register" event was send to emitter()')
        stub.reset()
      })
    })

    test('Registered Log object is formated as expected when log message is an Error', () => {
      const stub = sinon.stub()
      Emitter.on('register', (...args) => {
        stub(args)
      })

      Functions.forEach(method => {
        const LogMsg = new Error(faker.lorem.sentence())
        Logger[method](LogMsg, {data: true}, 4, 12, 13)
        const info = stub.firstCall.args[0][0]
        assert.isObject(info)
        assert.equal(info.level, ErrorLevels[method])
        assert.instanceOf(info.error, Error)
        assert.equal(info.error.message, LogMsg.message)
        assert.deepEqual(info.data, {data: true})
        assert.deepEqual(info.args, [4, 12, 13])
        assert.instanceOf(info.createdAt, Date)

        stub.reset()
      })
    })

    test('Registered Log object is formated as expected when log message is an string', () => {
      const stub = sinon.stub()
      Emitter.on('register', (...args) => {
        stub(args)
      })

      Functions.forEach(method => {
        const LogMsg = faker.lorem.sentence()
        Logger[method](LogMsg, {data: true}, 4, 12, 13)
        const info = stub.firstCall.args[0][0]
        assert.isObject(info)
        assert.equal(info.level, ErrorLevels[method])
        assert.instanceOf(info.error, Error)
        assert.equal(info.error.message, LogMsg)
        assert.deepEqual(info.data, {data: true})
        assert.deepEqual(info.args, [4, 12, 13])
        assert.instanceOf(info.createdAt, Date)

        stub.reset()
      })
    })

    test('Logger is called Once when Log Message was send', () => {
      Functions.forEach(method => {
        const LogMsg = faker.lorem.sentence()
        Logger[method](LogMsg, {data: true}, 4, 12, 13)
        assert.isTrue(mocks.logger.mocks.call.calledOnce)
        const info = mocks.logger.mocks.call.args[0][0][0]

        assert.isObject(info)
        assert.equal(info.level, ErrorLevels[method])
        assert.instanceOf(info.error, Error)
        assert.equal(info.error.message, LogMsg)
        assert.deepEqual(info.data, {data: true})
        assert.deepEqual(info.args, [4, 12, 13])
        assert.instanceOf(info.createdAt, Date)
        mocks.logger.reset()
      })
    })

    test('Logger is called with right LogObject when Log Message was send', () => {
      Functions.forEach(method => {
        const LogMsg = faker.lorem.sentence()
        Logger[method](LogMsg, {data: true}, 4, 12, 13)
        assert.isTrue(mocks.logger.mocks.call.calledOnce)
        mocks.logger.reset()
      })
    })
  })
})
