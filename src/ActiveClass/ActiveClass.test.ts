import ActiveClass from '.';
import Schema from '../Schema';
import ActiveClassError from './Error';

describe('ActiveClass: creating an ActiveClass', () => {
  const schema = {
    brand: Schema.string,
    topSpeed: Schema.number,
    age: Schema.number({ required: false })
  }
  class Car extends ActiveClass(schema) {}

  describe('happy creation path', () => {
    it('created class knows its name', () => {
      expect(Car.name).toBe('Car')
    })

    it('created class knows its database key', () => {
      expect(Car.key).toBe(`Cars`)
    })
  })

  describe('sad creation path', () => {
    it('throws an error when missing required properties', () => {
      expect.assertions(2)
      try {
        // @ts-ignore
        new Car({})
      } catch (err) {
        expect(err).toBeInstanceOf(ActiveClassError)
        expect(err.message).toMatch(`Could not construct Car. The required property 'brand' is missing`)
      }
    })
  })

  describe('.toObject', () => {
    it('removes any undefined properties', () => {
      const car = new Car({ brand: 'Ford', topSpeed: 20 })
      car.age = 5
      car.age = undefined
      const result = car.toObject()
      expect(result).toHaveProperty('brand')
      expect(result).toHaveProperty('topSpeed')
      expect(result).not.toHaveProperty('age')
      expect(Object.keys(result)).toHaveLength(2)
    })
  })

  describe('Extending with methods', () => {
    class Car extends ActiveClass(schema) {
      annualMOT() {
        this.age = (this.age || 0) + 1
      }
    }
    let car: Car

    it('can be extended', () => {
      car = new Car({ brand: 'Ford', topSpeed: 9 })
      expect(car.brand).toBe('Ford')
      expect(car.topSpeed).toBe(9)
      expect(car.age).toBeUndefined()
    })

    it('by default still throws error with bad types', () => {
      // @ts-ignore : check static error -> runtime error
      expect(() => { new Car({ brand: 'Ford' }) }).toThrow(/required/)
    })

    it('can use its new class methods', () => {
      car.annualMOT()
      expect(car.age).toBe(1)
    })

    it('retains its original key', () => {
      expect(Car.key).toBe('Cars')
    })

    it('can update its key via name', () => {
      Object.defineProperty(Car, 'name', { value: 'NewCar' })
      expect(Car.name).toBe('NewCar')
      expect(Car.key).toBe('NewCars')
      expect(Car.key).not.toBe('Car')
    })

    it('can be extended directly', () => {
      class SuperCar extends ActiveClass(schema) {
        polish() {
          this.brand = 'Ferrari'
          this.topSpeed = 100
        }
      }
      const car = new SuperCar({ brand: 'Ford', topSpeed: 40 })
      expect(car.brand).toBe('Ford')
      expect(car.topSpeed).toBe(40)
      car.polish()
      expect(car.brand).toBe('Ferrari')
      expect(car.topSpeed).toBe(100)
    })
  })
})

describe('ActiveClass: integration test', () => {
  describe('integration with Schema', () => {
    describe('simple non-nested schema', () => {
      const schema = {
        name: Schema.string,
        age: Schema.number({ required: false }),
        isCool: Schema.boolean({ default: false }),
        friends: Schema.number({ required: false }),
        children: Schema.number({ default: 4 }),
        parents: Schema.number({ optional: true })
      }

      class Player extends ActiveClass(schema) {}
      let player: InstanceType<typeof Player>

      describe('happy path', () => {
        it("allows new instances that follow the explicit and implied requirement and defaults", () => {
          player = new Player({ name: 'Pedro', age: 3, isCool: true })
        })

        it("uses the supplied values at creation", () => {
          expect(player.name).toBe('Pedro')
          expect(player.age).toBe(3)
          expect(player.isCool).toBe(true)
        })

        it("uses a default value only if it is not overwritten", () => {
          expect(player.isCool).toBe(true)
          expect(player.children).toBe(4)
        })

        it("has optional properties as defined only if not supplied", () => {
          expect(player.age).not.toBeUndefined()
          expect(player.friends).toBeUndefined()
          expect(player.parents).toBeUndefined()
        })

        it('is not syncing by default', () => {
          expect(player.syncOpts()).toMatchObject({ fromDb: false, toDb: false })
        })

        it('allows setting of properties as fitting the schema', () => {
          player.age = 5
          expect(player.age).toBe(5)
        })
      })

      describe('sad path', () => {
        it('throws an error when an implicitly required field is not supplied', () => {
          expect.assertions(1)
          try {
            // @ts-ignore : checking static type error leads to creation error
            new Player({ isCool: true })
          } catch (err) {
            expect(err.message).toMatch(`Could not construct Player. The required property 'name' is missing`)
          }
        })

        it('throws an error when fields supplied are of wrong type', () => {
          // @ts-ignore : checking static type error leads to creation error
          expect(() => new Player({ name: 4, age: 4, isCool: true })).toThrow(`Could not construct Player. The property 'name' is of the wrong type`)
        })

        it('throws an error when the `create` method is tried without a database connection', () => {
          expect(Player.create({ name: 'Pedro', age: 3, isCool: true })).rejects.toThrow('Could not create Player. Could not connect to your Firebase database. This might be because you have not initialized your Firebase app')
        })

        it('throws an error when a type is set to a non-schema compatible value', () => {
          const player = new Player({ name: 'Pedro', age: 4 })
          // @ts-ignore : check static error -> runtime error
          expect(() => { player.age = 'four' }).toThrow(`Player could not accept the value "four" (string) at path 'age'. The property 'age' is of the wrong type`)
          expect(player.age).not.toBe('four')
        })
      })
    })

    describe('enum', () => {
      const schema = {
        username: Schema.string,
        role: Schema.enum(['admin', 'regular']),
      }

      class User extends ActiveClass(schema) {}

      describe('happy path', () => {
        it('allows instantiation with a value from the array', () => {
          const user = new User({ username: 'Test', role: 'regular' })
          expect(user.role).toBe('regular')
        })

        it('can take a default', () => {
          const schema = {
            flavour: Schema.enum(['salty', 'sweet'], { default: 'salty' })
          }
          class Popcorn extends ActiveClass(schema) {}

          const popcorn = new Popcorn({})
          expect(popcorn.flavour).toBe('salty')
        })

        it('can be optional', () => {
          const schema = {
            name: Schema.enum(['river', 'ocean'], { optional: true })
          }
          class River extends ActiveClass(schema) {}

          const river = new River({})
          expect(river.name).toBeUndefined()
        })

        it('can take both strings and numbers', () => {
          const schema = {
            value: Schema.enum([1, 2, 'many'])
          }

          class Number extends ActiveClass(schema) {}
          const number = new Number({ value: 2 })
          expect(number.value).toBe(2)
        })
      })

      describe('sad path', () => {
        it('throws an error when a non-enumerator value is provided', () => {
          expect(() => {
            // @ts-ignore : checking static error -> runtime error
            new User({ username: 'hello', role: 'banana' })
          }).toThrow(/type/)
        })

        it('throws an error when a default value is not in the enum', () => {
          expect(() => {
            // @ts-ignore
            class Popcorn extends ActiveClass({
              flavour: Schema.enum(['salty', 'sweet'], { default: 'salt' })
            }) {}
          }).toThrow()
        })

        it('throws an error when setter is not in the enum', () => {
          const user = new User({ username: 'hello', role: 'admin' })
          // @ts-ignore : check static error -> runtime error
          expect(() => { user.role = 'dumb' }).toThrow(/type/)
        })
      })
    })

    describe('indexed', () => {
      const userSchema = {
        username: Schema.string,
        friends: Schema.indexed.string,
        numbers: Schema.indexed.enum([1, 2, 3])
      }
      class User extends ActiveClass(userSchema) {}

      const otherSchema = {
        keys: Schema.indexed.true,
        counts: Schema.indexed.number
      }
      class Other extends ActiveClass(otherSchema) {}

      describe('happy path', () => {
        it('allows instantiation with an appropriately indexed value', () => {
          const user = new User({
            username: 'Test',
            friends: { alfred: 'Alfred' },
            numbers: { first: 2 }
          })
          expect(user.friends.alfred).toBe('Alfred')
          expect(user.numbers.first).toBe(2)

          const other = new Other({
            keys: { random: true },
            counts: { text: 5 }
          })
          expect(other.keys.random).toBe(true)
          expect(other.counts.text).toBe(5)
        })

        it('allows reassignment', () => {
          const user = new User({
            username: 'Test',
            friends: { alfred: 'Alfred' },
            numbers: { first: 2 }
          })
          user.friends.alfred = 'Alfie'
          user.friends.bob = 'bobo'
          expect(user.friends.alfred).toBe('Alfie')
          expect(user.friends.bob).toBe('bobo')
        })
      })

      describe('sad path', () => {
        it('throws an error when a non appropriately indexed value is provided', () => {
          expect(() => {
            // @ts-ignore : checking static error -> runtime error
            new User({ username: 'hello', friends: { alfred: 4 }, numbers: { first: 2 } })
          }).toThrow(/type/)

          expect(() => {
            // @ts-ignore : checking static error -> runtime error
            new User({ username: 'hello', friends: { alfred: 'Afred' }, numbers: { first: 9 } })
          }).toThrow(/type/)
        })

        it('throws an error when assignment incompatible with indexing is made', () => {
          const user = new User({ username: 'hi', friends: { alfred: 'Alfred' }, numbers: { first: 2 } })
          // @ts-ignore : checking static error -> runtime error
          expect(() => { user.friends.bob = 4 }).toThrow(/type/)
          expect(user.friends.bob).not.toBe(4)
        })
      })
    })

    describe('nested schema', () => {
      const schema = {
        name: Schema.string,
        hours: {
          openingTime: Schema.number,
          closingTime: Schema.number({ default: 20 })
        },
        status: {
          isAccessible: Schema.boolean({ optional: true })
        }
      }

      class Venue extends ActiveClass(schema) {}

      describe('happy path', () => {
        it("allows new instances that follow the explicit and implied requirement and defaults", () => {
          const venue = new Venue({ name: 'WeWork', hours: { openingTime: 4 }, status: {} })
          expect(venue.name).toBe('WeWork')
          expect(venue.hours.openingTime).toBe(4)
          expect(venue.hours.closingTime).toBe(20)
          expect(venue.status.isAccessible).toBeUndefined()
        })
      })

      describe('sad path', () => {
        it('throws an error when a required nested property is not supplied', () => {
          expect(() => {
            // @ts-ignore : checking that static error -> thrown error
            new Venue({ name: 'TechHub', hours: { closingTime: 20 } })
          }).toThrow(/required/)
        })

        it('throws an error when a nested property does not fit the schema type', () => {
          expect(() => {
            // @ts-ignore : checking that static error -> thrown error
            new Venue({ name: 'TechHub', hours: { openingTime: true } })
          }).toThrow(/type/)
        })

        it('throws an error when assignment to nested property is attempted that does not fit schema', () => {
          const venue = new Venue({ name: 'WeWork', hours: { openingTime: 9 }, status: {} })
          // @ts-ignore : checking that static error -> thrown error
          expect(() => { venue.hours.openingTime = 'five' })
          expect(venue.hours.openingTime).not.toBe('five')
        })
      })
    })
  })
})