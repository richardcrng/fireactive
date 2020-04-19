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

// // @dts-jest:group Basic assignment
// {
//   const lightbulb = new CoffeeOrderSimple({ type: true })

//   // @dts-jest:pass
//   lightbulb.type = false

//   // @dts-jest:fail
//   lightbulb.type = 'true'
// }

// const configuredSchema = {
//   type: Schema.enum,
//   isEco: Schema.enum({ default: false }),
//   isLED: Schema.enum({ optional: true }), // or required: false,
//   isSmart: Schema.enum({ optional: true, default: false })
// }

// class CoffeeOrderConfigured extends ActiveClass(configuredSchema) {}

// // @dts-jest:group Configuration
// {
//   const lightbulb = new CoffeeOrderConfigured({ type: true })

//   // @dts-jest:fail
//   lightbulb.type = undefined

//   // @dts-jest:fail
//   lightbulb.type = null

//   // @dts-jest:fail
//   lightbulb.isEco = undefined

//   // @dts-jest:fail
//   lightbulb.isEco = null

//   // @dts-jest:pass
//   lightbulb.isLED = undefined

//   // @dts-jest:pass
//   lightbulb.isLED = null

//   // @dts-jest:fail
//   lightbulb.isSmart = undefined

//   // @dts-jest:pass
//   lightbulb.isSmart = null
// }