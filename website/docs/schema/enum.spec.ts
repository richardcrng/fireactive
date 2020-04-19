import { ActiveClass, Schema } from '../../../src'
import testExpectError from '../../../src/utils/testExpectError';
import ActiveClassError from '../../../src/ActiveClass/Error';

describe('Basic example', () => {
  const coffeeOrderSchema = {
    type: Schema.enum(['Americano', 'Latte', 'Cappucino'])
  }

  class CoffeeOrder extends ActiveClass(coffeeOrderSchema) { }

  describe('Creation', () => {
    describe('Runtime errors', () => {
      testExpectError(
        'Requires an argument',
        // @ts-ignore
        () => new CoffeeOrder(),
        { message: `Could not construct CoffeeOrder. The required property 'type' is missing`, constructor: ActiveClassError }
      )

      testExpectError(
        'Requires the property',
        // @ts-ignore
        () => new CoffeeOrder({}),
        { message: `Could not construct CoffeeOrder. The required property 'type' is missing`, constructor: ActiveClassError }
      )

      testExpectError(
        'Requires the property to be the right type',
        // @ts-ignore
        () => new CoffeeOrder({ type: 'Herbal' }),
        { message: `Could not construct CoffeeOrder. The property 'type' is of the wrong type`, constructor: ActiveClassError }
      )

      testExpectError(
        'Requires the property not to be null (strictNullChecks)',
        // @ts-ignore
        () => new CoffeeOrder({ type: null }),
        { message: `Could not construct CoffeeOrder. The property 'type' is of the wrong type`, constructor: ActiveClassError }
      )
    })

    test('Runtime passes', () => {
      // @ts-ignore
      expect(() => new CoffeeOrder({ type: 'Americano', randomProp: 'Latte' })).not.toThrow()
      expect(() => new CoffeeOrder({ type: 'Americano' })).not.toThrow()
      expect(() => new CoffeeOrder({ type: 'Latte' })).not.toThrow()
    })
  })

  describe('Updates', () => {
    const coffeeOrder = new CoffeeOrder({ type: 'Americano' })

    test("Can assign enum values", () => {
      coffeeOrder.type = 'Latte'
      expect(coffeeOrder.type).toBe('Latte')
    })

    testExpectError("Can't assign non-enum values", () => {
      // @ts-ignore
      coffeeOrder.type = 'Orange juice'
    }, { message: `CoffeeOrder could not accept the value "Orange juice" (string) at path 'type'. The property 'type' is of the wrong type`, constructor: ActiveClassError })
  })
})

describe('Configuration', () => {
  const coffeeOrderSchema = {
    type: Schema.enum(['Americano', 'Latte', 'Cappucino']),
    size: Schema.enum(['small', 'regular', 'large'], { default: 'regular' }),
    chain: Schema.enum(['Starbucks', 'Costa', 'Pret'], { optional: true }), // or required: false,
    milk: Schema.enum(['dairy', 'oat', 'soya'], { optional: true, default: 'dairy' })
  }

  class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

  const coffeeOrder = new CoffeeOrder({ type: 'Americano' })
  
  test('Initial values', () => {
    expect(coffeeOrder.type).toBe('Americano')
    expect(coffeeOrder.size).toBe('regular')
    expect(coffeeOrder.chain).toBeUndefined()
    expect(coffeeOrder.milk).toBe('dairy')
  })

  describe('Required with no default', () => {
    testExpectError('throws error when assigned undefined', () => {
      // @ts-ignore
      coffeeOrder.type = undefined
    }, { message: `CoffeeOrder could not accept the value undefined (undefined) at path 'type'. The required property 'type' is missing`, constructor: ActiveClassError })

    testExpectError('throws error when assigned null', () => {
      // @ts-ignore
      coffeeOrder.type = null
    }, { message: `CoffeeOrder could not accept the value null (object) at path 'type'. The property 'type' is of the wrong type`, constructor: ActiveClassError })
  })

  describe('Required with default', () => {    
    it('defaults when assigned undefined', () => {
      // @ts-ignore
      coffeeOrder.size = undefined
      expect(coffeeOrder.size).toBe('regular')
    })

    testExpectError('throws error when assigned null', () => {
      // @ts-ignore
      coffeeOrder.size = null
    }, { message: `CoffeeOrder could not accept the value null (object) at path 'size'. The property 'size' is of the wrong type`, constructor: ActiveClassError })
  })

  describe('Optional with no default', () => {
    it('does not default or throw error when assigned undefined', () => {
      // @ts-ignore
      coffeeOrder.chain = undefined
      expect(coffeeOrder.chain).toBeUndefined()
    })

    it('does not default or throw error when assigned null', () => {
      // @ts-ignore
      coffeeOrder.chain = null
      expect(coffeeOrder.chain).toBeNull()
    })
  })

  describe('Optional with default', () => {
    it('defaults when assigned undefined', () => {
      // @ts-ignore
      coffeeOrder.milk = undefined
      expect(coffeeOrder.milk).toBe('dairy')
    })

    it('does not default or throw error when assigned null', () => {
      // @ts-ignore
      coffeeOrder.milk = null
      expect(coffeeOrder.milk).toBeNull()
    })
  })
})