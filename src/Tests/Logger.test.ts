import * as chai from 'chai'
import * as faker from 'faker'
import * as joi from 'joi'
import * as _ from 'lodash'
import * as sinon from 'sinon'
import { ReportersInterface } from '../Interfaces/LoggingInterfaces'

const assert = chai.assert
suite('Test Logger Functionality', () => {
  let Config
  let Dependencies
  let ErrorLevels
  let Logger

  const mocks = {
    debug: sinon.stub(),
    logger: require('./testFiles/Logger'),
    reporters: require('./testFiles/Reporter')(),
  }

  beforeEach(() => {
    Config = {
      reporters: [],
      reporting: {
        silent: false,
      },
    }
    Config.reporters = [new mocks.reporters.Instance()]

    const Events = require('events')
    Dependencies = {
      Debug: mocks.debug,
      Joi: require('joi'),
      LogEmitter: new class LogEventEmitter extends Events {}(),
      Logger: mocks.logger.instance,
      _: require('lodash'),
    }
    Logger = require('../Logger')

    ErrorLevels = ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug']
  })

  afterEach(() => {
    mocks.debug.reset()
    mocks.logger.restore()
    mocks.reporters.Reset()
    Dependencies.LogEmitter.removeAllListeners()
  })

  suite('Test Constructor', () => {
    test('should throw Error when not all Dependencies are available', () => {
      assert.throws(() => new Logger({}, undefined), 'ApiStart.Logger: Dependencies are missing or not complete')
    })

    test('should throw Error when Logging Config isn\'t avaialble', () => {
      assert.throws(() => new Logger(Dependencies, undefined), 'ApiStart.Logger: Config not available')
    })

    test('should throw error when Config isn\'t valid', () => {
      Config.silent = 'uyfgdjhd'
      assert.throws(() => new Logger(Dependencies, Config), 'ApiStart.Logger: Config not valid')
    })

    test('should return an Logger Instance when Config is valid', () => {
      assert.isOk(new Logger(Dependencies, Config))
    })
  })

  suite('Test Call Functionality', () => {
    let LoggerInstance
    let LogObject

    beforeEach(() => {
      LoggerInstance = new Logger(Dependencies, Config)
      LogObject = {
        args: [14, 2, 12],
        createdAt: new Date(),
        data: {
          data: true,
        },
        error: new Error(faker.lorem.sentence()),
        level: 0,
      }
    })

    test('Make sure Logger only reports event when it is alowed by the config.', () => {
      const stub = sinon.stub()
      Dependencies.LogEmitter.on('log', (...args) => {
        stub(args)
      })

      const silentOptions = [true, false, undefined]

      for (let minimallvl = 0; minimallvl < ErrorLevels.length; minimallvl++) {
        for (let i = 0; i < 2; i++) {
          Config.reporting.silent = silentOptions[i]
          Config.reporting.minimalLevel2Report = minimallvl
          LoggerInstance = new Logger(Dependencies, Config)

          ErrorLevels.forEach((keyword, severityLvl) => {
            LogObject.level = severityLvl
            LoggerInstance.Call(LogObject)

            if (silentOptions[i] !== true && severityLvl <= minimallvl)
              assert.isTrue(
                stub.calledOnce,
                `Didn't add a log event on lvl "${keyword}" while it was required. Minimal log level was "${
                  ErrorLevels[minimallvl]
                }" and silent was "${silentOptions[i]}"`,
              )
            else
              assert.isFalse(
                stub.calledOnce,
                `Did add a log event on lvl "${keyword}" while this wasn't allowed. Minimal log level was "${
                  ErrorLevels[minimallvl]
                }" and silent was "${silentOptions[i]}"`,
              )

            stub.reset()
          })
        }
      }
    })

    test('Make sure Logger reports correct when no reporting options are given', () => {
      const stub = sinon.stub()
      Dependencies.LogEmitter.on('log', (...args) => {
        stub(args)
      })
      Config.reporting = undefined
      LoggerInstance = new Logger(Dependencies, Config)

      ErrorLevels.forEach((keyword, severityLvl) => {
        LogObject.level = severityLvl
        LoggerInstance.Call(LogObject)

        assert.isTrue(stub.calledOnce, `Didn't add a log event on lvl "${keyword}" while it was required.`)

        stub.reset()
      })
    })

    test('Make sure that Log event has correct LogInfoObject', () => {
      const stub = sinon.stub()

      Dependencies.LogEmitter.on('log', (...args) => {
        stub(args)
      })

      LoggerInstance.Call(LogObject)

      assert.isTrue(stub.calledOnce, 'Didn\'t add a log event on LogEmitter')
      const info = stub.firstCall.args[0][0]
      assert.isObject(info, 'Log info isn\'t a object')
      assert.equal(info.level, LogObject.level, 'Log level doesn\'t match expectations')
      assert.instanceOf(info.error, Error, 'Log error doesn\'t match expectations')
      assert.deepEqual(info.error, LogObject.error, 'Log errormsg doesn\'t match expectations')
      assert.deepEqual(info.data, LogObject.data, 'Log data doesn\'t match expectations')
      assert.deepEqual(info.args, LogObject.args, 'Log args doesn\'t match expectations')
      assert.deepEqual(info.createdAt, LogObject.createdAt, 'Log creationDate doesn\'t match expectations')
    })

    test('Make sure that reporters got noticed and has correct LogObject', () => {
      const tries = Math.round(Math.random() * 5)
      for (let i = 0; i <= tries; i++) {
        const reporters: any[] = [] // tslint:disable-line:no-any
        const NumbReporters = Math.round(Math.random() * 5)

        for (let x = 0; x <= NumbReporters; x++) {
          const reporter = require('./testFiles/Reporter')()
          reporters.push(reporter)

          Config.reporters.push(new reporter.Instance())
        }

        LoggerInstance = new Logger(Dependencies, Config)
        LoggerInstance.Call(LogObject)

        reporters.forEach(reporter => {
          const stub = reporter.Stub.Log

          assert.isTrue(stub.calledOnce, 'Caller() didn\'t call Reporter')
          const info = stub.firstCall.args[0][0]
          assert.isObject(info, 'Log info isn\'t a object')
          assert.equal(info.level, LogObject.level, 'Log level doesn\'t match expectations')
          assert.instanceOf(info.error, Error, 'Log error doesn\'t match expectations')
          assert.deepEqual(info.error, LogObject.error, 'Log errormsg doesn\'t match expectations')
          assert.deepEqual(info.data, LogObject.data, 'Log data doesn\'t match expectations')
          assert.deepEqual(info.args, LogObject.args, 'Log args doesn\'t match expectations')
          assert.deepEqual(info.createdAt, LogObject.createdAt, 'Log creationDate doesn\'t match expectations')
        })
        Config.reporters = []
      }
    })

    suite('Make sure that Call() handles a rejected promise of a reporter', () => {
      let reporter1
      let reporter2
      let TestError

      beforeEach(() => {
        TestError = new Error(faker.lorem.sentence())
        reporter1 = require('./testFiles/Reporter')()
        reporter2 = require('./testFiles/Reporter')()

        reporter2.Stub.Log.throwsException(TestError)

        Config.reporters = [new reporter1.Instance(), new reporter2.Instance()]

        LoggerInstance = new Logger(Dependencies, Config)
      })

      test('By generating new Error log item', done => {
        const stub = sinon.stub()
        Dependencies.LogEmitter.on('log', (...args) => {
          stub(args)
        })

        LoggerInstance.Call(LogObject)
        setTimeout(() => {
          assert.isTrue(stub.calledTwice, 'log event wasn\'t send')

          const info = stub.secondCall.args[0][0]
          assert.isObject(info, 'Log info isn\'t a object')
          assert.equal(info.level, ErrorLevels.indexOf('err'), 'Log level doesn\'t match expectations')
          assert.instanceOf(info.error, Error, 'Log error doesn\'t match expectations')
          assert.deepEqual(
            info.error.message,
            `Reporter "Test Reporter", rejected report promise`,
            'Log errormsg doesn\'t match expectations',
          )
          assert.deepEqual(
            info.data,
            {
              error: TestError,
            },
            'Log data doesn\'t match expectations',
          )
          assert.deepEqual(info.args, [], 'Log args doesn\'t match expectations')
          assert.instanceOf(info.createdAt, Date, 'Log creationDate doesn\'t match expectations')
          done()
        },         10)
      })

      test('By not sending this error to reporter that caused it.', done => {
        LoggerInstance.Call(LogObject)
        setTimeout(() => {
          assert.isTrue(reporter1.Stub.Log.calledTwice)
          assert.isFalse(reporter2.Stub.Log.calledTwice)
          done()
        },         10)
      })
    })

    suite('Make sure that Call() handels a reporter that timesout', () => {
      test('By Generating a new Warning Log Item', done => {
        const stub = sinon.stub()
        Dependencies.LogEmitter.on('log', (...args) => {
          stub(args)
        })

        const reporter1 = require('./testFiles/Reporter')()
        const reporter2 = require('./testFiles/ReporterTimeOut')()
        const newConfig = _.cloneDeep(Config)
        newConfig.reporters = [new reporter1.Instance(), new reporter2.Instance()]

        const reporter2Instance = new reporter2.Instance()
        LoggerInstance = new Logger(Dependencies, newConfig)

        LoggerInstance.Call(LogObject)
        setTimeout(() => {
          assert.isTrue(stub.calledTwice, 'log event wasn\'t send')

          const info = stub.secondCall.args[0][0]
          assert.isObject(info, 'Log info isn\'t a object')
          assert.equal(info.level, ErrorLevels.indexOf('warning'), 'Log level doesn\'t match expectations')
          assert.instanceOf(info.error, Error, 'Log error doesn\'t match expectations')
          assert.deepEqual(
            info.error.message,
            `REPORTER TIMEOUT: Reporter "${reporter2Instance.Name}" didn't response within "${
              reporter2Instance.TimeOut
            }" miliseconds. `,
            'Log errormsg doesn\'t match expectations',
          )
          assert.deepEqual(
            info.data,
            {
              error: LogObject.error,
              timeoutTime: new reporter2.Instance().TimeOut,
            },
            'Log data doesn\'t match expectations',
          )
          assert.deepEqual(info.args, [], 'Log args doesn\'t match expectations')
          assert.instanceOf(info.createdAt, Date, 'Log creationDate doesn\'t match expectations')
          done()
        },         20)
      })

      test('By not sending this warning to the reporter that caused it.', done => {
        const TestError = new Error(faker.lorem.sentence())
        const reporter1 = require('./testFiles/Reporter')()
        const reporter2 = require('./testFiles/ReporterTimeOut')()
        const newConfig = _.cloneDeep(Config)
        newConfig.reporters = [new reporter1.Instance(), new reporter2.Instance()]

        LoggerInstance = new Logger(Dependencies, newConfig)

        LoggerInstance.Call(LogObject)
        setTimeout(() => {
          assert.isTrue(reporter1.Stub.Log.calledTwice)
          assert.isFalse(reporter2.Stub.Log.calledTwice)
          done()
        },         20)
      })
    })
  })
})
