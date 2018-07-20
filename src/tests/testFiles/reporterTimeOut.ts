import * as sinon from 'sinon'

const stub = {
  log: sinon.stub(),
}

const reset = () => {
  stub.log.reset()
}

export class Instance {
  public readonly name = 'Test Timeout Reporter'
  public readonly timeOut = 5
  constructor() {}

  public log(...args) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res('timeOut failed')
      }, 5000)
    })
  }
}

export default {Instance, stub, reset}
