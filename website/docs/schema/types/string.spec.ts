import { ActiveClass, Schema } from '../../../../src'
import testExpectError from '../../../../src/utils/testExpectError';
import ActiveClassError from '../../../../src/ActiveClass/Error';

describe('Basic example', () => {
  const dinosaurSchema = {
    species: Schema.string
  }

  class Dinosaur extends ActiveClass(dinosaurSchema) { }

  describe('Creation', () => {
    describe('Runtime errors', () => {
      testExpectError(
        'Requires an argument',
        // @ts-ignore
        () => new Dinosaur(),
        { message: `Could not construct Dinosaur. The required property 'species' is missing`, constructor: ActiveClassError }
      )

      testExpectError(
        'Requires the property',
        // @ts-ignore
        () => new Dinosaur({}),
        { message: `Could not construct Dinosaur. The required property 'species' is missing`, constructor: ActiveClassError }
      )

      testExpectError(
        'Requires the property to be the right type',
        // @ts-ignore
        () => new Dinosaur({ species: true }),
        { message: `Could not construct Dinosaur. The property 'species' is of the wrong type`, constructor: ActiveClassError }
      )

      testExpectError(
        'Requires the property not to be null (strictNullChecks)',
        // @ts-ignore
        () => new Dinosaur({ species: null }),
        { message: `Could not construct Dinosaur. The property 'species' is of the wrong type`, constructor: ActiveClassError }
      )
    })

    test('Runtime passes', () => {
      // @ts-ignore
      expect(() => new Dinosaur({ species: 'Diplodocus', randomProp: 'Triceratops' })).not.toThrow()
      expect(() => new Dinosaur({ species: 'Diplodocus' })).not.toThrow()
      expect(() => new Dinosaur({ species: 'Triceratops' })).not.toThrow()
    })
  })

  describe('Updates', () => {
    const dinosaur = new Dinosaur({ species: 'Diplodocus' })

    test("Can assign string values", () => {
      dinosaur.species = 'T-Rex'
      expect(dinosaur.species).toBe('T-Rex')
    })

    testExpectError("Can't assign non-string values", () => {
      // @ts-ignore
      dinosaur.species = 7
    }, { message: `Dinosaur could not accept the value 7 (number) at path 'species'. The property 'species' is of the wrong type`, constructor: ActiveClassError })
  })
})

describe('Configuration', () => {
  const dinosaurSchema = {
    species: Schema.string,
    roar: Schema.string({ default: 'RAWR' }),
    name: Schema.string({ optional: true }), // or required: false,
    home: Schema.string({ optional: true, default: 'Earth' })
  }

  class Dinosaur extends ActiveClass(dinosaurSchema) {}

  const dinosaur = new Dinosaur({ species: 'Diplodocus' })
  
  test('Initial values', () => {
    expect(dinosaur.species).toBe('Diplodocus')
    expect(dinosaur.roar).toBe('RAWR')
    expect(dinosaur.name).toBeUndefined()
    expect(dinosaur.home).toBe('Earth')
  })

  describe('Required with no default', () => {
    testExpectError('throws error when assigned undefined', () => {
      // @ts-ignore
      dinosaur.species = undefined
    }, { message: `Dinosaur could not accept the value undefined (undefined) at path 'species'. The required property 'species' is missing`, constructor: ActiveClassError })

    testExpectError('throws error when assigned null', () => {
      // @ts-ignore
      dinosaur.species = null
    }, { message: `Dinosaur could not accept the value null (object) at path 'species'. The property 'species' is of the wrong type`, constructor: ActiveClassError })
  })

  describe('Required with default', () => {    
    it('defaults when assigned undefined', () => {
      // @ts-ignore
      dinosaur.roar = undefined
      expect(dinosaur.roar).toBe('RAWR')
    })

    testExpectError('throws error when assigned null', () => {
      // @ts-ignore
      dinosaur.roar = null
    }, { message: `Dinosaur could not accept the value null (object) at path 'roar'. The property 'roar' is of the wrong type`, constructor: ActiveClassError })
  })

  describe('Optional with no default', () => {
    it('does not default or throw error when assigned undefined', () => {
      // @ts-ignore
      dinosaur.name = undefined
      expect(dinosaur.name).toBeUndefined()
    })

    it('does not default or throw error when assigned null', () => {
      // @ts-ignore
      dinosaur.name = null
      expect(dinosaur.name).toBeNull()
    })
  })

  describe('Optional with default', () => {
    it('defaults when assigned undefined', () => {
      // @ts-ignore
      dinosaur.home = undefined
      expect(dinosaur.home).toBe('Earth')
    })

    it('does not default or throw error when assigned null', () => {
      // @ts-ignore
      dinosaur.home = null
      expect(dinosaur.home).toBeNull()
    })
  })
})