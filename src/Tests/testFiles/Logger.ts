import * as sinon from 'sinon'

const mocks = {
  call: sinon.stub(),
  constructor: sinon.stub(),
}

const reset = function() {
  mocks.constructor.reset()
  mocks.call.resetHistory()
}

const instance = class {
  public readonly LogLevels = ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug']

  constructor(...args) {
    mocks.constructor(args)
  }

  public call(...args) {
    mocks.call(args)
    return
  }
}

module.exports = {mocks, instance, reset}
