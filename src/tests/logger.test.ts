import * as chai from 'chai'
import * as joi from 'joi'
import * as faker from 'faker'
import * as _ from 'lodash'
import * as events from 'events'
import reporter from './testFiles/reporter'
import reporterTimeOut from './testFiles/reporterTimeOut'
import reporterReject from './testFiles/reporterReject'
import {Dependencies, LogObjectInterface, LogLevels} from '../interfaces'
import logger from '../logger'

const assert = chai.assert
suite('Test logger Functionality', () => {
  const logLevels: LogLevels[] = ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug']
  let emitter = new events()
  let deps: Dependencies = {
    _,
    joi,
    logEmitter: emitter,
  }

  beforeEach(() => {
    emitter = new events()
    deps = {
      _,
      joi,
      logEmitter: emitter,
    }
  })

  afterEach(() => {
    emitter.removeAllListeners()
    reporter.reset()
    reporterTimeOut.reset()
  })

  suite('Test factory()', () => {
    test('rerturns instance of logger', () => {
      const loghandlerClass = logger.factory({reporters: []})
      assert.instanceOf(loghandlerClass, logger)
    })
  })

  suite('Test Constructor()', () => {
    test('throws Error when Config is undefined', () => {
      assert.throws(() => new logger(deps, undefined as any), 'LogHandler.Logger: Config not available')
    })

    test('throws Error when Config is not valid', () => {
      assert.throws(
        () => new logger(deps, {doSomething: faker.lorem.slug()} as any),
        'LogHandler.Logger: Config not valid',
      )
    })

    test('throws error when dependencies are missing', () => {
      assert.throws(
        () => new logger({} as any, {reporters: []}),
        'LogHandler.Logger: Dependencies are missing or not complete',
      )
    })
  })

  suite('Test call()', () => {
    let exampleLogObject: LogObjectInterface = {
      args: [faker.lorem.slug(), {test: faker.lorem.slug()}],
      createdAt: new Date(),
      data: {
        txt: faker.lorem.sentence(),
      },
      error: new Error(faker.lorem.sentence()),
      level: logLevels.indexOf(LogLevels.warning),
    }

    beforeEach(() => {
      exampleLogObject = {
        args: [faker.lorem.slug(), {test: faker.lorem.slug()}],
        createdAt: new Date(),
        data: {
          txt: faker.lorem.sentence(),
        },
        error: new Error(faker.lorem.sentence()),
        level: logLevels.indexOf(LogLevels.warning),
      }
    })

    test('emitter receives "log" event with logObject when something need to be logged', done => {
      const loggerClass = new logger(deps, {reporters: []})

      emitter.on('log', data => {
        assert.deepEqual(exampleLogObject, data)
        done()
      })

      loggerClass.call(exampleLogObject)
    })

    suite('Validate Config behaviour', () => {
      test('Reports by default', done => {
        emitter.on('log', data => {
          assert.deepEqual(exampleLogObject, data)
          done()
        })
        const loggerClass = new logger(deps, {reporters: []})
        loggerClass.call(exampleLogObject)
      })

      test('does report when silent is on true', done => {
        emitter.on('log', data => {
          done()
        })
        const loggerClass = new logger(deps, {reporters: [], reporting: {silent: false}})
        loggerClass.call(exampleLogObject)
        assert.fail('log item should report')
      })

      test("doesn't report when silent is on true", done => {
        emitter.on('log', data => {
          assert.fail('log item is reported')
        })
        const loggerClass = new logger(deps, {reporters: [], reporting: {silent: true}})
        loggerClass.call(exampleLogObject)
        done()
      })

      test("doesn't report when minimalLevel2Report is lower than log item", done => {
        emitter.on('log', data => {
          assert.fail('log item is reported')
        })
        const loggerClass = new logger(deps, {reporters: [], reporting: {minimalLevel2Report: LogLevels.crit}})
        loggerClass.call(exampleLogObject)
        done()
      })

      test('does report when minimalLevel2Report is lower than log item', done => {
        emitter.on('log', data => {
          done()
        })
        const loggerClass = new logger(deps, {reporters: [], reporting: {minimalLevel2Report: LogLevels.debug}})
        loggerClass.call(exampleLogObject)

        assert.fail("log item isn't reported")
      })

      test('does report when minimalLevel2Report is same level as log item', done => {
        emitter.on('log', data => {
          done()
        })
        const loggerClass = new logger(deps, {reporters: [], reporting: {minimalLevel2Report: LogLevels.warning}})
        loggerClass.call(exampleLogObject)

        assert.fail("log item isn't reported")
      })
    })

    suite('test Reporter', () => {
      test('reporter gets all logObject and has the possibility to report', () => {
        const testReporter = new reporter.Instance() as any
        const loggerClass = new logger(deps, {reporters: [testReporter]})

        loggerClass.call(exampleLogObject)
        assert.isTrue(reporter.stub.log.callCount === 1)
        assert.deepEqual(reporter.stub.log.args[0][0][0], exampleLogObject)
      })

      test('reporter can be timeouted when it takes longer than allowed', done => {
        let i = 0
        const timeOutReporter = new reporterTimeOut.Instance() as any
        const loggerClass = new logger(deps, {reporters: [timeOutReporter]})

        emitter.on('log', (data: LogObjectInterface) => {
          i += 1
          if (
            data.error.message ===
            `REPORTER TIMEOUT: Reporter "${timeOutReporter.name}" didn\'t response within "${
              timeOutReporter.timeOut
            }" miliseconds.`
          ) {
            done()
          } else if (i > 1) {
            assert.fail("Reporter didn't timeout")
          }
        })

        loggerClass.call(exampleLogObject)
      })

      test('reporter can be timeouted when it takes longer than allowed', done => {
        let i = 0
        const rejectedReporter = new reporterReject.Instance() as any
        const loggerClass = new logger(deps, {reporters: [rejectedReporter]})

        emitter.on('log', (data: LogObjectInterface) => {
          i += 1
          if (data.error.message === `Reporter "${rejectedReporter.name}", rejected report promise`) {
            done()
          } else if (i > 1) {
            assert.fail("Reporter didn't timeout")
          }
        })

        loggerClass.call(exampleLogObject)
      })
    })
  })
})
