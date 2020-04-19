import { ActiveClass, Schema } from '../../../src'

const schema = {
  booleanVals: Schema.indexed.boolean,
  fooOrBarVals: Schema.indexed.enum(['foo', 'bar']),
  numberVals: Schema.indexed.number,
  stringVals: Schema.indexed.string,
  trueVals: Schema.indexed.true
}

class Dictionary extends ActiveClass(schema) {}

// @dts-jest:group Basic creation
{
  // @dts-jest:pass
  new Dictionary({})

  // @dts-jest:fail
  new Dictionary({ booleanVals: { test: 'false' } })

  // @dts-jest:pass
  new Dictionary({ booleanVals: { test: false } })

  // @dts-jest:fail
  new Dictionary({ fooOrBarVals: { test: 'foobar' } })

  // @dts-jest:pass
  new Dictionary({ fooOrBarVals: { test: 'foo' } })

  // @dts-jest:fail
  new Dictionary({ numberVals: { test: '5' } })

  // @dts-jest:pass
  new Dictionary({ numberVals: { test: 5 } })

  // @dts-jest:fail
  new Dictionary({ stringVals: { test: 5 } })

  // @dts-jest:pass
  new Dictionary({ stringVals: { test: '5' } })

  // @dts-jest:fail
  new Dictionary({ trueVals: { test: false } })

  // @dts-jest:pass
  new Dictionary({ trueVals: { test: true } })
}

// // @dts-jest:group Basic assignment
// {
//   const coffeeOrder = new Dictionary({ type: 'Americano' })

//   // @dts-jest:pass
//   coffeeOrder.type = 'Latte'

//   // @dts-jest:fail
//   coffeeOrder.type = 'Orange juice'
// }
