import * as sinon from 'sinon'

const stub = {
  log: sinon.stub(),
}

const reset = () => {
  stub.log.reset()
}

export class Instance {
  public readonly name = 'Test Reporter'

  constructor() {}

  public async log(...args) {
    stub.log(args)
    return 'normal'
  }
}

export default {Instance, stub, reset}
