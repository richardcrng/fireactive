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

  describe('Assignment / updates', () => {
    const dictionary = new Dictionary({})
    
    test('Defaulting to empty objects', () => {
      expect(dictionary.booleanVals).toEqual({})
      expect(dictionary.fooOrBarVals).toEqual({})
      expect(dictionary.numberVals).toEqual({})
      expect(dictionary.stringVals).toEqual({})
      expect(dictionary.trueVals).toEqual({})
    })
    
    describe('Runtime errors', () => {
      const cases: [keyof Dictionary, any][] = [
        ['booleanVals', 'false'],
        ['fooOrBarVals', 'BAR'],
        ['numberVals', '5'],
        ['stringVals', 5],
        ['trueVals', false]
      ]

      cases.forEach(([key, disallowedVal]) => {
        testExpectError(
          `Cannot index incorrectly in ${key}`,
          () => {
            // @ts-ignore
            dictionary[key].someProp = disallowedVal
          },
          { message: `Dictionary could not accept the value ${typeof disallowedVal === 'string' ? `"${disallowedVal}"` : disallowedVal } (${typeof disallowedVal}) at path '${key}.someProp'. The property '${key}' is of the wrong type`, constructor: ActiveClassError }
        )
      })
    })

    describe('Runtime passes', () => {
      it('allows assignment of matching properties', () => {
        const cases: [keyof Dictionary, any][] = [
          ['booleanVals', true],
          ['fooOrBarVals', 'bar'],
          ['numberVals', 5],
          ['stringVals', '5'],
          ['trueVals', true]
        ]

        cases.forEach(([key, allowedVal]) => {
          // @ts-ignore
          dictionary[key].someProp = allowedVal
          // @ts-ignore
          expect(dictionary[key].someProp).toBe(allowedVal)
        })
      })
    })
  })
})