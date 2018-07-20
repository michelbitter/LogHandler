import * as chai from 'chai'
import index from '../index'
import {Config} from '../interfaces'
import logHandler from '../logHandler'

const assert = chai.assert

suite('Test Plugin', () => {
  test('index returns logHandler', () => {
    const config: Config = {reporters: []}
    const logHandlerClass = logHandler.factory(config)
    const plugin = index(config)

    assert.hasAllDeepKeys(plugin, logHandlerClass.getLogHandler())
  })
})
