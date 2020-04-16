import { ActiveClass, Schema } from '../../../src'
import testExpectError from '../../../src/utils/testExpectError';
import ActiveClassError from '../../../src/ActiveClass/Error';

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

  // describe('Updates', () => {
  //   const dinosaur = new Dinosaur({ species: 4 })

  //   test("Can assign boolean values", () => {
  //     dinosaur.species = 5
  //     expect(dinosaur.species).toBe(5)
  //   })

  //   testExpectError("Can't assign non-boolean values", () => {
  //     // @ts-ignore
  //     dinosaur.species = '5'
  //   }, { message: `Dinosaur could not accept the value "5" (string) at path 'species'. The property 'species' is of the wrong type`, constructor: ActiveClassError })
  // })
})

// describe('Configuration', () => {
//   const dinosaurSchema = {
//     species: Schema.string,
//     doors: Schema.string({ default: 1 }),
//     rooms: Schema.string({ optional: true }), // or required: false,
//     chimneys: Schema.string({ optional: true, default: 2 })
//   }

//   class Dinosaur extends ActiveClass(dinosaurSchema) {}

//   const dinosaur = new Dinosaur({ species: 4 })
  
//   test('Initial values', () => {
//     expect(dinosaur.species).toBe(4)
//     expect(dinosaur.doors).toBe(1)
//     expect(dinosaur.rooms).toBeUndefined()
//     expect(dinosaur.chimneys).toBe(2)
//   })

//   describe('Required with no default', () => {
//     testExpectError('throws error when assigned undefined', () => {
//       // @ts-ignore
//       dinosaur.species = undefined
//     }, { message: `Dinosaur could not accept the value undefined (undefined) at path 'species'. The required property 'species' is missing`, constructor: ActiveClassError })

//     testExpectError('throws error when assigned null', () => {
//       // @ts-ignore
//       dinosaur.species = null
//     }, { message: `Dinosaur could not accept the value null (object) at path 'species'. The property 'species' is of the wrong type`, constructor: ActiveClassError })
//   })

//   describe('Required with default', () => {    
//     it('defaults when assigned undefined', () => {
//       // @ts-ignore
//       dinosaur.doors = undefined
//       expect(dinosaur.doors).toBe(1)
//     })

//     testExpectError('throws error when assigned null', () => {
//       // @ts-ignore
//       dinosaur.doors = null
//     }, { message: `Dinosaur could not accept the value null (object) at path 'doors'. The property 'doors' is of the wrong type`, constructor: ActiveClassError })
//   })

//   describe('Optional with no default', () => {
//     it('does not default or throw error when assigned undefined', () => {
//       // @ts-ignore
//       dinosaur.rooms = undefined
//       expect(dinosaur.rooms).toBeUndefined()
//     })

//     it('does not default or throw error when assigned null', () => {
//       // @ts-ignore
//       dinosaur.rooms = null
//       expect(dinosaur.rooms).toBeNull()
//     })
//   })

//   describe('Optional with default', () => {
//     it('defaults when assigned undefined', () => {
//       // @ts-ignore
//       dinosaur.chimneys = undefined
//       expect(dinosaur.chimneys).toBe(2)
//     })

//     it('does not default or throw error when assigned null', () => {
//       // @ts-ignore
//       dinosaur.chimneys = null
//       expect(dinosaur.chimneys).toBeNull()
//     })
//   })
// })