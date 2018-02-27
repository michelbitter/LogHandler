import * as sinon from 'sinon'

const mocks = {
  Call: sinon.stub(),
  constructor: sinon.stub(),
}

const restore = function() {
  mocks.constructor.reset()
  mocks.Call.resetHistory()
}

const instance = class {
  public const readonly LogLevels = [
    'emerg',
    'alert',
    'crit',
    'err',
    'warning',
    'notice',
    'info',
    'debug',
  ]

  constructor(...args) {
    mocks.constructor(args)
  }

  public Call(...args) {
    mocks.Call(args)
    return
  }
}

module.exports = {mocks, instance, restore}
