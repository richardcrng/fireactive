import { ActiveClass, Schema } from '../../../src'

const simpleSchema = {
  type: Schema.enum(['Americano', 'Latte', 'Capuccino'])
}

class CoffeeOrderSimple extends ActiveClass(simpleSchema) {}

// @dts-jest:group Basic creation
{
  // @dts-jest:fail
  new CoffeeOrderSimple()

  // @dts-jest:fail
  new CoffeeOrderSimple({})

  // @dts-jest:fail
  new CoffeeOrderSimple({ type: 'Herbal' })

  // @dts-jest:fail
  new CoffeeOrderSimple({ type: null })

  // @dts-jest:fail
  new CoffeeOrderSimple({ type: 'Americano', randomProp: 'Latte' })

  // @dts-jest:pass
  new CoffeeOrderSimple({ type: 'Americano' })

  // @dts-jest:pass
  new CoffeeOrderSimple({ type: 'Latte' })
}

// @dts-jest:group Basic assignment
{
  const coffeeOrder = new CoffeeOrderSimple({ type: 'Americano' })

  // @dts-jest:pass
  coffeeOrder.type = 'Latte'

  // @dts-jest:fail
  coffeeOrder.type = 'Orange juice'
}

// const configuredSchema = {
//   type: Schema.enum,
//   isEco: Schema.enum({ default: false }),
//   isLED: Schema.enum({ optional: true }), // or required: false,
//   isSmart: Schema.enum({ optional: true, default: false })
// }

// class CoffeeOrderConfigured extends ActiveClass(configuredSchema) {}

// // @dts-jest:group Configuration
// {
//   const coffeeOrder = new CoffeeOrderConfigured({ type: true })

//   // @dts-jest:fail
//   coffeeOrder.type = undefined

//   // @dts-jest:fail
//   coffeeOrder.type = null

//   // @dts-jest:fail
//   coffeeOrder.isEco = undefined

//   // @dts-jest:fail
//   coffeeOrder.isEco = null

//   // @dts-jest:pass
//   coffeeOrder.isLED = undefined

//   // @dts-jest:pass
//   coffeeOrder.isLED = null

//   // @dts-jest:fail
//   coffeeOrder.isSmart = undefined

//   // @dts-jest:pass
//   coffeeOrder.isSmart = null
// }