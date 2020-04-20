import { ActiveClass, Schema } from '../../../../src'

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

// @dts-jest:group Basic assignment
{
  const dictionary = new Dictionary({})

  // @dts-jest:fail
  dictionary.booleanVals.someProp = 'false'

  // @dts-jest:pass
  dictionary.booleanVals.someProp = false

  // @dts-jest:fail
  dictionary.fooOrBarVals.someProp = 'BAR'

  // @dts-jest:pass
  dictionary.fooOrBarVals.someProp = 'bar'

  // @dts-jest:fail
  dictionary.numberVals.someProp = '5'

  // @dts-jest:pass
  dictionary.numberVals.someProp = 5

  // @dts-jest:fail
  dictionary.stringVals.someProp = 5

  // @dts-jest:pass
  dictionary.stringVals.someProp = '5'

  // @dts-jest:fail
  dictionary.trueVals.someProp = false

  // @dts-jest:pass
  dictionary.trueVals.someProp = true
}
