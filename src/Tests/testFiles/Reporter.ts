module.exports = () => {
  const sinon = require('sinon')

  const Stub = {
    Log: sinon.stub(),
  }

  const Reset = () => {
    Stub.Log.reset()
  }

  class Instance {
    public readonly Name = 'Test Reporter'

    constructor() {}

    public async Log(...args) {
      Stub.Log(args)
      return
    }
  }

  return {Instance, Stub, Reset}
}
