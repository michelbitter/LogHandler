module.exports = () => {
  const sinon = require('sinon')

  const Stub = {
    log: sinon.stub(),
  }

  const Reset = () => {
    Stub.log.reset()
  }

  class Instance {
    public readonly name = 'Test Reporter'

    constructor() {}

    public async log(...args) {
      Stub.log(args)
      return 'normal'
    }
  }

  return {Instance, Stub, Reset}
}
