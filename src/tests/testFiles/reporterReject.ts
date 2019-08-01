import * as sinon from 'sinon'

const stub = {
  log: sinon.stub(),
}

const reset = () => {
  stub.log.reset()
}

export class Instance {
  public readonly name = 'Test Reject Reporter'
  public readonly timeOut = 5
  constructor() {}

  public log() {
    throw new Error('something terible goes wrong!')
  }
}

export default {Instance, stub, reset}
