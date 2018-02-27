import * as sinon from 'sinon'

const stubs = {
  functions: {
    alert: sinon.stub(),
    crit: sinon.stub(),
    debug: sinon.stub(),
    emerg: sinon.stub(),
    emitter: sinon
      .stub()
      .returns(new class MyEventEmitter extends require('events') {}()),
    err: sinon.stub(),
    info: sinon.stub(),
    notice: sinon.stub(),
    warning: sinon.stub(),
  },
  loggingHandler: sinon.stub(),

}

const reset = () => {
  stubs.loggingHandler.reset()
  stubs.functions.emerg.reset()
  stubs.functions.alert.reset()
  stubs.functions.crit.reset()
  stubs.functions.err.reset()
  stubs.functions.warning.reset()
  stubs.functions.notice.reset()
  stubs.functions.info.reset()
  stubs.functions.debug.reset()
  stubs.functions.emitter.resetHistory()
}

const instance = function(...args) {
  stubs.loggingHandler(args)
  return {
    alert: stubs.functions.alert,
    crit: stubs.functions.crit,
    debug: stubs.functions.debug,
    emerg: stubs.functions.emerg,
    emitter: stubs.functions.emitter,
    err: stubs.functions.err,
    info: stubs.functions.info,
    notice: stubs.functions.notice,
    warning: stubs.functions.warning,
  }
}

module.exports = () =>
  ({instance, reset, stubs})
