"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const faker = require("faker");
const joi = require("joi");
const _ = require("lodash");
const events = require("events");
const logHandler_1 = require("../logHandler");
const interfaces_1 = require("../interfaces");
const logger_1 = require("./testFiles/logger");
const assert = chai.assert;
suite('Test logHandler Functionality', () => {
    let deps = {
        _,
        joi,
        logger: new logger_1.default.instance(),
        logEmitter: new events(),
    };
    beforeEach(() => {
        deps = {
            _,
            joi,
            logger: new logger_1.default.instance(),
            logEmitter: new events(),
        };
    });
    suite('Test factory()', () => {
        test('rerturns instance of logHandler', () => {
            const loghandlerClass = logHandler_1.default.factory({ reporters: [] });
            assert.instanceOf(loghandlerClass, logHandler_1.default);
        });
    });
    suite('Test Constructor()', () => {
        test('throws Error when Config is undefined', () => {
            assert.throws(() => new logHandler_1.default(deps, undefined), 'LogHandler: Config not available');
        });
        test('throws Error when Config is not valid', () => {
            assert.throws(() => new logHandler_1.default(deps, { doSomething: faker.lorem.slug() }), 'LogHandler: Config not valid');
        });
        test('throws error when dependencies are missing', () => {
            assert.throws(() => new logHandler_1.default({}, { reporters: [] }), 'LogHandler: Dependencies are missing or not complete');
        });
    });
    suite('Test getEmitter()', () => {
        test('returns instanceof Events', () => {
            const config = { reporters: [] };
            const logHandlerClass = logHandler_1.default.factory(config);
            const emitter = logHandlerClass.getEmitter();
            assert.instanceOf(emitter, events);
        });
    });
    suite('Test getLogHandler()', () => {
        const config = { reporters: [] };
        const logLevels = ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug'];
        let logHandlerClass = logHandler_1.default.factory(config);
        let eventEmitter = logHandlerClass.getEmitter();
        beforeEach(() => {
            logHandlerClass = new logHandler_1.default(deps, config);
            eventEmitter = logHandlerClass.getEmitter();
        });
        afterEach(() => {
            logger_1.default.reset();
            eventEmitter.removeAllListeners();
        });
        test('Make sure all logLevels have an report function', () => {
            const output = logHandlerClass.getLogHandler();
            logLevels.forEach(lvl => {
                assert.exists(output[lvl]);
                assert.isFunction(output[lvl]);
            });
        });
        test('report functions can handle errors', () => {
            const reportFunctionSchema = joi.func().minArity(1);
            const output = logHandlerClass.getLogHandler();
            logLevels.forEach(lvl => {
                joi.assert(output[lvl], reportFunctionSchema);
                const before = logger_1.default.mocks.call.callCount;
                output[lvl](new Error(faker.lorem.sentence()));
                assert.isTrue(before + 1 === logger_1.default.mocks.call.callCount);
            });
        });
        test('report functions generates errorObj as expected', () => {
            const reportFunctionSchema = joi.func().minArity(1);
            const output = logHandlerClass.getLogHandler();
            logLevels.forEach(lvl => {
                const count = logger_1.default.mocks.call.callCount;
                const errorMsg = new Error(faker.lorem.sentence());
                const data = faker.lorem.paragraph();
                const arg1 = faker.lorem.slug();
                const arg2 = faker.lorem.slug();
                output[lvl](errorMsg, { testData: data }, arg1, { test: arg2 });
                const errorObj = logger_1.default.mocks.call.args[count][0][0];
                const errorObjSchema = joi.object({
                    args: joi
                        .array()
                        .items(joi.alternatives().try([joi.string().valid([arg1]), joi.object({ test: joi.string().valid(arg2) })]))
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
                    level: joi.valid(interfaces_1.LogLevelsKeys.indexOf(lvl)),
                });
                joi.assert(errorObj, errorObjSchema);
            });
        });
        test('report function accepts Error and string input', () => {
            const reportFunctionSchema = joi.func().minArity(1);
            const output = logHandlerClass.getLogHandler();
            logLevels.forEach(lvl => {
                joi.assert(output[lvl], reportFunctionSchema);
                const before = logger_1.default.mocks.call.callCount;
                output[lvl](new Error(faker.lorem.sentence()));
                output[lvl](faker.lorem.sentence());
                assert.isTrue(before + 2 === logger_1.default.mocks.call.callCount);
            });
        });
        test('Log reports are correctly registered in LogEmitter', done => {
            const log = logHandlerClass.getLogHandler();
            const errorMsg = new Error(faker.lorem.slug());
            const data = faker.lorem.slug();
            const arg1 = faker.lorem.slug();
            const arg2 = faker.lorem.slug();
            const errorObjSchema = joi.object({
                args: joi
                    .array()
                    .items(joi.alternatives().try([joi.string().valid([arg1]), joi.object({ test: joi.string().valid(arg2) })]))
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
                level: joi.valid(interfaces_1.LogLevelsKeys.indexOf(interfaces_1.LogLevels.alert)),
            });
            eventEmitter.on('register', (logData) => {
                joi.assert(logData, errorObjSchema);
                done();
            });
            log.alert(errorMsg, { testData: data }, arg1, { test: arg2 });
        });
    });
});
//# sourceMappingURL=logHandler.test.js.map