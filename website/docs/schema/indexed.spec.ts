import { ActiveClass, Schema } from '../../../src'
import testExpectError from '../../../src/utils/testExpectError';
import ActiveClassError from '../../../src/ActiveClass/Error';

describe('Basic example', () => {
  const schema = {
    booleanVals: Schema.indexed.boolean,
    fooOrBarVals: Schema.indexed.enum(['foo', 'bar']),
    numberVals: Schema.indexed.number,
    stringVals: Schema.indexed.string,
    trueVals: Schema.indexed.true
  }

  class Dictionary extends ActiveClass(schema) { }


  describe('Creation', () => {
    describe('Runtime errors', () => {
      testExpectError(
        'Indexed booleans',
        // @ts-ignore
        () => new Dictionary({ booleanVals: { test: 'true' } }),
        { message: `Could not construct Dictionary. The property 'booleanVals' is of the wrong type`, constructor: ActiveClassError }
      )

      testExpectError(
        'Indexed enums',
        // @ts-ignore
        () => new Dictionary({ fooOrBarVals: { test: 'foobar' } }),
        { message: `Could not construct Dictionary. The property 'fooOrBarVals' is of the wrong type`, constructor: ActiveClassError }
      )

      testExpectError(
        'Indexed numbers',
        // @ts-ignore
        () => new Dictionary({ numberVals: { test: '5' } }),
        { message: `Could not construct Dictionary. The property 'numberVals' is of the wrong type`, constructor: ActiveClassError }
      )

      testExpectError(
        'Indexed strings',
        // @ts-ignore
        () => new Dictionary({ stringVals: { test: 5 } }),
        { message: `Could not construct Dictionary. The property 'stringVals' is of the wrong type`, constructor: ActiveClassError }
      )

      testExpectError(
        'Indexed trues',
        // @ts-ignore
        () => new Dictionary({ trueVals: { test: 5 } }),
        { message: `Could not construct Dictionary. The property 'trueVals' is of the wrong type`, constructor: ActiveClassError }
      )
    })

    test('Runtime passes', () => {
      expect(() => new Dictionary({ booleanVals: { test: false } })).not.toThrow()
      expect(() => new Dictionary({ fooOrBarVals: { test: 'foo' } })).not.toThrow()
      expect(() => new Dictionary({ numberVals: { test: 5 } })).not.toThrow()
      expect(() => new Dictionary({ stringVals: { test: '5' } })).not.toThrow()
      expect(() => new Dictionary({ trueVals: { test: true } })).not.toThrow()
    })
  })
})