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

  // describe('Updates', () => {
  //   const coffeeOrder = new CoffeeOrder({ type: true })

  //   test("Can assign enum values", () => {
  //     coffeeOrder.type = false
  //     expect(coffeeOrder.type).toBe(false)
  //   })

  //   testExpectError("Can't assign non-enum values", () => {
  //     // @ts-ignore
  //     coffeeOrder.type = 'true'
  //   }, { message: `CoffeeOrder could not accept the value "true" (string) at path 'type'. The property 'type' is of the wrong type`, constructor: ActiveClassError })
  // })
})

// describe('Configuration', () => {
//   const coffeeOrderSchema = {
//     type: Schema.enum,
//     isEco: Schema.enum({ default: false }),
//     isLED: Schema.enum({ optional: true }), // or required: false,
//     isSmart: Schema.enum({ optional: true, default: false })
//   }

//   class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

//   const coffeeOrder = new CoffeeOrder({ type: false })
  
//   test('Initial values', () => {
//     expect(coffeeOrder.type).toBe(false)
//     expect(coffeeOrder.isEco).toBe(false)
//     expect(coffeeOrder.isLED).toBeUndefined()
//     expect(coffeeOrder.isSmart).toBe(false)
//   })

//   describe('Required with no default', () => {
//     testExpectError('throws error when assigned undefined', () => {
//       // @ts-ignore
//       coffeeOrder.type = undefined
//     }, { message: `CoffeeOrder could not accept the value undefined (undefined) at path 'type'. The required property 'type' is missing`, constructor: ActiveClassError })

//     testExpectError('throws error when assigned null', () => {
//       // @ts-ignore
//       coffeeOrder.type = null
//     }, { message: `CoffeeOrder could not accept the value null (object) at path 'type'. The property 'type' is of the wrong type`, constructor: ActiveClassError })
//   })

//   describe('Required with default', () => {    
//     it('defaults when assigned undefined', () => {
//       // @ts-ignore
//       coffeeOrder.isEco = undefined
//       expect(coffeeOrder.isEco).toBe(false)
//     })

//     testExpectError('throws error when assigned null', () => {
//       // @ts-ignore
//       coffeeOrder.isEco = null
//     }, { message: `CoffeeOrder could not accept the value null (object) at path 'isEco'. The property 'isEco' is of the wrong type`, constructor: ActiveClassError })
//   })

//   describe('Optional with no default', () => {
//     it('does not default or throw error when assigned undefined', () => {
//       // @ts-ignore
//       coffeeOrder.isLED = undefined
//       expect(coffeeOrder.isLED).toBeUndefined()
//     })

//     it('does not default or throw error when assigned null', () => {
//       // @ts-ignore
//       coffeeOrder.isLED = null
//       expect(coffeeOrder.isLED).toBeNull()
//     })
//   })

//   describe('Optional with default', () => {
//     it('defaults when assigned undefined', () => {
//       // @ts-ignore
//       coffeeOrder.isSmart = undefined
//       expect(coffeeOrder.isSmart).toBe(false)
//     })

//     it('does not default or throw error when assigned null', () => {
//       // @ts-ignore
//       coffeeOrder.isSmart = null
//       expect(coffeeOrder.isSmart).toBeNull()
//     })
//   })
// })