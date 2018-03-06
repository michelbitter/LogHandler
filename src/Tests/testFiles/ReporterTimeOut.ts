module.exports = () => {
  const sinon = require('sinon')

  const Stub = {
    log: sinon.stub(),
  }

  const Reset = () => {
    Stub.log.reset()
  }

  class Instance {
    public readonly name = 'Test Timeout Reporter'
    public readonly timeOut = 10

    public log(...args) {
      return new Promise((res, rej) => {
        Stub.log(args)
        setTimeout(() => {
          res('PROMISE GELUKT')
        }, 5000)
      })
    }
  }

  return {Instance, Stub, Reset}
}
