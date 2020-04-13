import { ActiveClass, Schema } from '../../../src'
import testExpectError from '../../../src/utils/testExpectError';
import ActiveClassError from '../../../src/ActiveClass/Error';

const lightbulbSchema = {
  isOn: Schema.boolean
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

describe('Runtime errors', () => {
  testExpectError(
    'Requires an argument',
    // @ts-ignore
    () => new Lightbulb(),
    { message: `Could not construct Lightbulb. The required property 'isOn' is missing`, constructor: ActiveClassError }
  )

  testExpectError(
    'Requires the property',
    // @ts-ignore
    () => new Lightbulb({}),
    { message: `Could not construct Lightbulb. The required property 'isOn' is missing`, constructor: ActiveClassError }
  )

  testExpectError(
    'Requires the property to be the right type',
    // @ts-ignore
    () => new Lightbulb({ isOn: 'yes' }),
    { message: `Could not construct Lightbulb. The property 'isOn' is of the wrong type`, constructor: ActiveClassError }
  )

  testExpectError(
    'Requires the property not to be null (strictNullChecks)',
    // @ts-ignore
    () => new Lightbulb({ isOn: null }),
    { message: `Could not construct Lightbulb. The property 'isOn' is of the wrong type`, constructor: ActiveClassError }
  )
})

test('Runtime passes', () => {
  expect(() => new Lightbulb({ isOn: true })).not.toThrow()
  expect(() => new Lightbulb({ isOn: false })).not.toThrow()
})