"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const joi = require("joi");
const faker = require("faker");
const _ = require("lodash");
const events = require("events");
const reporter_1 = require("./testFiles/reporter");
const reporterTimeOut_1 = require("./testFiles/reporterTimeOut");
const reporterReject_1 = require("./testFiles/reporterReject");
const interfaces_1 = require("../interfaces");
const logger_1 = require("../logger");
const assert = chai.assert;
suite('Test logger Functionality', () => {
    const logLevels = ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug'];
    let emitter = new events();
    let deps = {
        _,
        joi,
        logEmitter: emitter,
    };
    beforeEach(() => {
        emitter = new events();
        deps = {
            _,
            joi,
            logEmitter: emitter,
        };
    });
    afterEach(() => {
        emitter.removeAllListeners();
        reporter_1.default.reset();
        reporterTimeOut_1.default.reset();
    });
    suite('Test factory()', () => {
        test('rerturns instance of logger', () => {
            const loghandlerClass = logger_1.default.factory({ reporters: [] });
            assert.instanceOf(loghandlerClass, logger_1.default);
        });
    });
    suite('Test Constructor()', () => {
        test('throws Error when Config is undefined', () => {
            assert.throws(() => new logger_1.default(deps, undefined), 'LogHandler.Logger: Config not available');
        });
        test('throws Error when Config is not valid', () => {
            assert.throws(() => new logger_1.default(deps, { doSomething: faker.lorem.slug() }), 'LogHandler.Logger: Config not valid');
        });
        test('throws error when dependencies are missing', () => {
            assert.throws(() => new logger_1.default({}, { reporters: [] }), 'LogHandler.Logger: Dependencies are missing or not complete');
        });
    });
    suite('Test call()', () => {
        let exampleLogObject = {
            args: [faker.lorem.slug(), { test: faker.lorem.slug() }],
            createdAt: new Date(),
            data: {
                txt: faker.lorem.sentence(),
            },
            error: new Error(faker.lorem.sentence()),
            level: logLevels.indexOf(interfaces_1.LogLevels.warning),
        };
        beforeEach(() => {
            exampleLogObject = {
                args: [faker.lorem.slug(), { test: faker.lorem.slug() }],
                createdAt: new Date(),
                data: {
                    txt: faker.lorem.sentence(),
                },
                error: new Error(faker.lorem.sentence()),
                level: logLevels.indexOf(interfaces_1.LogLevels.warning),
            };
        });
        test('emitter receives "log" event with logObject when something need to be logged', done => {
            const loggerClass = new logger_1.default(deps, { reporters: [] });
            emitter.on('log', data => {
                assert.deepEqual(exampleLogObject, data);
                done();
            });
            loggerClass.call(exampleLogObject);
        });
        suite('Validate Config behaviour', () => {
            test('Reports by default', done => {
                emitter.on('log', data => {
                    assert.deepEqual(exampleLogObject, data);
                    done();
                });
                const loggerClass = new logger_1.default(deps, { reporters: [] });
                loggerClass.call(exampleLogObject);
            });
            test('does report when silent is on true', done => {
                emitter.on('log', data => {
                    done();
                });
                const loggerClass = new logger_1.default(deps, { reporters: [], reporting: { silent: false } });
                loggerClass.call(exampleLogObject);
                assert.fail('log item should report');
            });
            test("doesn't report when silent is on true", done => {
                emitter.on('log', data => {
                    assert.fail('log item is reported');
                });
                const loggerClass = new logger_1.default(deps, { reporters: [], reporting: { silent: true } });
                loggerClass.call(exampleLogObject);
                done();
            });
            test("doesn't report when minimalLevel2Report is lower than log item", done => {
                emitter.on('log', data => {
                    assert.fail('log item is reported');
                });
                const loggerClass = new logger_1.default(deps, { reporters: [], reporting: { minimalLevel2Report: interfaces_1.LogLevels.crit } });
                loggerClass.call(exampleLogObject);
                done();
            });
            test('does report when minimalLevel2Report is lower than log item', done => {
                emitter.on('log', data => {
                    done();
                });
                const loggerClass = new logger_1.default(deps, { reporters: [], reporting: { minimalLevel2Report: interfaces_1.LogLevels.debug } });
                loggerClass.call(exampleLogObject);
                assert.fail("log item isn't reported");
            });
            test('does report when minimalLevel2Report is same level as log item', done => {
                emitter.on('log', data => {
                    done();
                });
                const loggerClass = new logger_1.default(deps, { reporters: [], reporting: { minimalLevel2Report: interfaces_1.LogLevels.warning } });
                loggerClass.call(exampleLogObject);
                assert.fail("log item isn't reported");
            });
        });
        suite('test Reporter', () => {
            test('reporter gets all logObject and has the possibility to report', () => {
                const testReporter = new reporter_1.default.Instance();
                const loggerClass = new logger_1.default(deps, { reporters: [testReporter] });
                loggerClass.call(exampleLogObject);
                assert.isTrue(reporter_1.default.stub.log.callCount === 1);
                assert.deepEqual(reporter_1.default.stub.log.args[0][0][0], exampleLogObject);
            });
            test('reporter can be timeouted when it takes longer than allowed', done => {
                let i = 0;
                const timeOutReporter = new reporterTimeOut_1.default.Instance();
                const loggerClass = new logger_1.default(deps, { reporters: [timeOutReporter] });
                emitter.on('log', (data) => {
                    i += 1;
                    if (data.error.message ===
                        `REPORTER TIMEOUT: Reporter "${timeOutReporter.name}" didn\'t response within "${timeOutReporter.timeOut}" miliseconds.`) {
                        done();
                    }
                    else if (i > 1) {
                        assert.fail("Reporter didn't timeout");
                    }
                });
                loggerClass.call(exampleLogObject);
            });
            test('reporter can be timeouted when it takes longer than allowed', done => {
                let i = 0;
                const rejectedReporter = new reporterReject_1.default.Instance();
                const loggerClass = new logger_1.default(deps, { reporters: [rejectedReporter] });
                emitter.on('log', (data) => {
                    i += 1;
                    if (data.error.message === `Reporter "${rejectedReporter.name}", rejected report promise`) {
                        done();
                    }
                    else if (i > 1) {
                        assert.fail("Reporter didn't timeout");
                    }
                });
                loggerClass.call(exampleLogObject);
            });
        });
    });
});
//# sourceMappingURL=logger.test.js.map