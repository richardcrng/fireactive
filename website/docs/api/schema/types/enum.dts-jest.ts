import { ActiveClass, Schema } from '../../../../../src'

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

const configuredSchema = {
  type: Schema.enum(['Americano', 'Latte', 'Cappucino']),
  size: Schema.enum(['small', 'regular', 'large'], { default: 'small' }),
  chain: Schema.enum(['Starbucks', 'Costa', 'Pret'], { optional: true }), // or required: false,
  milk: Schema.enum(['dairy', 'oat', 'soya'], { optional: true, default: 'dairy' })
}

class CoffeeOrderConfigured extends ActiveClass(configuredSchema) {}

// @dts-jest:group Configuration
{
  const coffeeOrder = new CoffeeOrderConfigured({ type: 'Americano' })

  // @dts-jest:fail
  coffeeOrder.type = undefined

  // @dts-jest:fail
  coffeeOrder.type = null

  // @dts-jest:fail
  coffeeOrder.size = undefined

  // @dts-jest:fail
  coffeeOrder.size = null

  // @dts-jest:pass
  coffeeOrder.chain = undefined

  // @dts-jest:pass
  coffeeOrder.chain = null

  // @dts-jest:fail
  coffeeOrder.milk = undefined

  // @dts-jest:pass
  coffeeOrder.milk = null
}