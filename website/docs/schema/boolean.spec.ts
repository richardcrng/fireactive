import { ActiveClass, Schema } from '../../../src'
import testExpectError from '../../../src/utils/testExpectError';
import ActiveClassError from '../../../src/ActiveClass/Error';

describe('Basic example', () => {
  const lightbulbSchema = {
    isOn: Schema.boolean
  }

  class Lightbulb extends ActiveClass(lightbulbSchema) { }

  describe('Creation', () => {
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
  })

  describe('Updates', () => {
    const lightbulb = new Lightbulb({ isOn: true })

    test("Can assign boolean values", () => {
      lightbulb.isOn = false
      expect(lightbulb.isOn).toBe(false)
    })

    testExpectError("Can't assign non-boolean values", () => {
      // @ts-ignore
      lightbulb.isOn = 'true'
    }, { message: `Lightbulb could not accept the value "true" (string) at path 'isOn'. The property 'isOn' is of the wrong type`, constructor: ActiveClassError })
  })
})

describe('Configuration', () => {
  const lightbulbSchema = {
    isOn: Schema.boolean({ default: false }),
    isLED: Schema.boolean({ optional: true }), // or required: false,
    isSmart: Schema.boolean({ optional: true, default: false })
  }

  class Lightbulb extends ActiveClass(lightbulbSchema) {}

  const bulbOne = new Lightbulb({})
  
  test('Initial values', () => {
    expect(bulbOne.isOn).toBe(false)
    expect(bulbOne.isLED).toBeUndefined()
    expect(bulbOne.isSmart).toBe(false)
  })

  test('Required property defaults when undefined', () => {
    // @ts-ignore
    bulbOne.isOn = undefined
    expect(bulbOne.isOn).toBe(false)
  })

  test('Optional property does not default when undefined', () => {
    // @ts-ignore
    bulbOne.isSmart = undefined
    expect(bulbOne.isSmart).toBe(false)
    // @ts-ignore
    bulbOne.isSmart = null
    expect(bulbOne.isSmart).toBeNull()
  })

  // describe.only('errors', () => {
  //   testExpectError("Can't assign undefined to required property", () => {
  //     // @ts-ignore
  //     bulbOne.isOn = undefined
  //   }, { message: `Lightbulb could not accept the value null (object) at path 'isOn'. The property 'isOn' is of the wrong type`, constructor: ActiveClassError })
  // })
})