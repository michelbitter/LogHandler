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
    public readonly TimeOut = 10

    public Log(...args) {
      return new Promise((res, rej) => {
        Stub.Log(args)
        setTimeout(() => {
          res('PROMISE GELUKT')
        },         5000)
      })
    }
  }

  return {Instance, Stub, Reset}
}
