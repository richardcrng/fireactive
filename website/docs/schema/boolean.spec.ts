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
    isOn: Schema.boolean,
    isEco: Schema.boolean({ default: false }),
    isLED: Schema.boolean({ optional: true }), // or required: false,
    isSmart: Schema.boolean({ optional: true, default: false })
  }

  class Lightbulb extends ActiveClass(lightbulbSchema) {}

  const bulbOne = new Lightbulb({ isOn: false })
  
  test('Initial values', () => {
    expect(bulbOne.isOn).toBe(false)
    expect(bulbOne.isEco).toBe(false)
    expect(bulbOne.isLED).toBeUndefined()
    expect(bulbOne.isSmart).toBe(false)
  })

  describe('Required with no default', () => {
    testExpectError('throws error when assigned undefined', () => {
      // @ts-ignore
      bulbOne.isOn = undefined
    }, { message: `Lightbulb could not accept the value undefined (undefined) at path 'isOn'. The required property 'isOn' is missing`, constructor: ActiveClassError })

    testExpectError('throws error when assigned null', () => {
      // @ts-ignore
      bulbOne.isOn = null
    }, { message: `Lightbulb could not accept the value null (object) at path 'isOn'. The property 'isOn' is of the wrong type`, constructor: ActiveClassError })
  })

  describe('Required with default', () => {    
    it('defaults when assigned undefined', () => {
      // @ts-ignore
      bulbOne.isEco = undefined
      expect(bulbOne.isEco).toBe(false)
    })

    testExpectError('throws error when assigned null', () => {
      // @ts-ignore
      bulbOne.isEco = null
    }, { message: `Lightbulb could not accept the value null (object) at path 'isEco'. The property 'isEco' is of the wrong type`, constructor: ActiveClassError })
  })

  describe('Optional with no default', () => {
    it('does not default or throw error when assigned undefined', () => {
      // @ts-ignore
      bulbOne.isLED = undefined
      expect(bulbOne.isLED).toBeUndefined()
    })

    it('does not default or throw error when assigned null', () => {
      // @ts-ignore
      bulbOne.isLED = null
      expect(bulbOne.isLED).toBeNull()
    })
  })

  describe('Optional with default', () => {
    it('defaults when assigned undefined', () => {
      // @ts-ignore
      bulbOne.isSmart = undefined
      expect(bulbOne.isSmart).toBe(false)
    })

    it('does not default or throw error when assigned null', () => {
      // @ts-ignore
      bulbOne.isSmart = null
      expect(bulbOne.isSmart).toBeNull()
    })
  })
})