import { ActiveClass, Schema } from '../../../src'
import testExpectError from '../../../src/utils/testExpectError';
import ActiveClassError from '../../../src/ActiveClass/Error';

describe('Basic example', () => {
  const buildingSchema = {
    floors: Schema.number
  }

  class Building extends ActiveClass(buildingSchema) { }

  describe('Creation', () => {
    describe('Runtime errors', () => {
      testExpectError(
        'Requires an argument',
        // @ts-ignore
        () => new Building(),
        { message: `Could not construct Building. The required property 'floors' is missing`, constructor: ActiveClassError }
      )

      testExpectError(
        'Requires the property',
        // @ts-ignore
        () => new Building({}),
        { message: `Could not construct Building. The required property 'floors' is missing`, constructor: ActiveClassError }
      )

      testExpectError(
        'Requires the property to be the right type',
        // @ts-ignore
        () => new Building({ floors: '4' }),
        { message: `Could not construct Building. The property 'floors' is of the wrong type`, constructor: ActiveClassError }
      )

      testExpectError(
        'Requires the property not to be null (strictNullChecks)',
        // @ts-ignore
        () => new Building({ floors: null }),
        { message: `Could not construct Building. The property 'floors' is of the wrong type`, constructor: ActiveClassError }
      )
    })

    test('Runtime passes', () => {
      // @ts-ignore
      expect(() => new Building({ floors: 4, randomProp: 9 })).not.toThrow()
      expect(() => new Building({ floors: 4 })).not.toThrow()
      expect(() => new Building({ floors: 9})).not.toThrow()
    })
  })

  describe('Updates', () => {
    const building = new Building({ floors: 4 })

    test("Can assign number values", () => {
      building.floors = 5
      expect(building.floors).toBe(5)
    })

    testExpectError("Can't assign non-number values", () => {
      // @ts-ignore
      building.floors = '5'
    }, { message: `Building could not accept the value "5" (string) at path 'floors'. The property 'floors' is of the wrong type`, constructor: ActiveClassError })
  })
})

describe('Configuration', () => {
  const buildingSchema = {
    floors: Schema.number,
    doors: Schema.number({ default: 1 }),
    rooms: Schema.number({ optional: true }), // or required: false,
    chimneys: Schema.number({ optional: true, default: 2 })
  }

  class Building extends ActiveClass(buildingSchema) {}

  const building = new Building({ floors: 4 })
  
  test('Initial values', () => {
    expect(building.floors).toBe(4)
    expect(building.doors).toBe(1)
    expect(building.rooms).toBeUndefined()
    expect(building.chimneys).toBe(2)
  })

  describe('Required with no default', () => {
    testExpectError('throws error when assigned undefined', () => {
      // @ts-ignore
      building.floors = undefined
    }, { message: `Building could not accept the value undefined (undefined) at path 'floors'. The required property 'floors' is missing`, constructor: ActiveClassError })

    testExpectError('throws error when assigned null', () => {
      // @ts-ignore
      building.floors = null
    }, { message: `Building could not accept the value null (object) at path 'floors'. The property 'floors' is of the wrong type`, constructor: ActiveClassError })
  })

  describe('Required with default', () => {    
    it('defaults when assigned undefined', () => {
      // @ts-ignore
      building.doors = undefined
      expect(building.doors).toBe(1)
    })

    testExpectError('throws error when assigned null', () => {
      // @ts-ignore
      building.doors = null
    }, { message: `Building could not accept the value null (object) at path 'doors'. The property 'doors' is of the wrong type`, constructor: ActiveClassError })
  })

  describe('Optional with no default', () => {
    it('does not default or throw error when assigned undefined', () => {
      // @ts-ignore
      building.rooms = undefined
      expect(building.rooms).toBeUndefined()
    })

    it('does not default or throw error when assigned null', () => {
      // @ts-ignore
      building.rooms = null
      expect(building.rooms).toBeNull()
    })
  })

  describe('Optional with default', () => {
    it('defaults when assigned undefined', () => {
      // @ts-ignore
      building.chimneys = undefined
      expect(building.chimneys).toBe(2)
    })

    it('does not default or throw error when assigned null', () => {
      // @ts-ignore
      building.chimneys = null
      expect(building.chimneys).toBeNull()
    })
  })
})