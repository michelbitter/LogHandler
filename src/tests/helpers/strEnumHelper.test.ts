import * as chai from 'chai'
import {strEnumHelper} from '../../helpers/strEnumHelper'
const assert = chai.assert

suite('Test strEnumHelper', () => {
  test('check output when array with string are given', () => {
    const list = ['this', 'is', 'a', 'test', 'array']
    const strEnum = strEnumHelper(list)
    list.forEach(item => {
      if (!(item in strEnum) || strEnum[item] !== item) {
        assert.fail("strEnumHelper didn't respond with an object as expected")
      }
    })
  })
})
