import * as sinon from 'sinon'

const mocks = {
  call: sinon.stub(),
}

const reset = function() {
  mocks.call.resetHistory()
}

const instance = class {
  public call(...args) {
    mocks.call(args)
    return
  }
}

export default {mocks, instance, reset}
