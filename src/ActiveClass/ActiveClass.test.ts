import ActiveClass from '.';
import Schema from '../Schema';

describe('ActiveClass: creating a BaseClass', () => {
  const className = 'Car'
  const schema = {
    brand: Schema.string,
    topSpeed: Schema.number,
    age: Schema.number({ required: false })
  }
  const BaseCar = ActiveClass(className, schema)

  it('created class knows its name', () => {
    expect(BaseCar.name).toBe(className)
  })

  it('created class knows its database key', () => {
    expect(BaseCar.key).toBe(`${className}s`)
  })

  describe('.toObject', () => {
    it('removes any undefined properties', () => {
      const car = new BaseCar({ brand: 'Ford', topSpeed: 20 })
      car.age = 5
      car.age = undefined
      const result = car.toObject()
      expect(result).toHaveProperty('brand')
      expect(result).toHaveProperty('topSpeed')
      expect(result).not.toHaveProperty('age')
      expect(Object.keys(result)).toHaveLength(2)
    })
  })

  describe('Extending', () => {
    class Car extends BaseCar {
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
      expect(Car.key).toBe(BaseCar.key)
    })

    it('can update its key via name', () => {
      Object.defineProperty(Car, 'name', { value: 'NewCar' })
      expect(Car.name).toBe('NewCar')
      expect(Car.key).toBe('NewCars')
      expect(Car.key).not.toBe(BaseCar)
    })

    it('can be extended directly', () => {
      class SuperCar extends ActiveClass(className, schema) {
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
      const className = 'Player'
      const schema = {
        name: Schema.string,
        age: Schema.number({ required: false }),
        isCool: Schema.boolean({ default: false }),
        friends: Schema.number({ required: false }),
        children: Schema.number({ default: 4 }),
        parents: Schema.number({ optional: true })
      }

      const Player = ActiveClass(className, schema)
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
          expect.assertions(4)
          try {
            // @ts-ignore : checking static type error leads to creation error
            new Player({ isCool: true })
          } catch (err) {
            expect(err.message).toMatch(/instantiate/)
            expect(err.message).toMatch(/Player/)
            expect(err.message).toMatch(/required/)
            expect(err.message).toMatch(/'name'/)
          }
        })

        it('throws an error when fields supplied are of wrong type', () => {
          // @ts-ignore : checking static type error leads to creation error
          expect(() => new Player({ name: 4, age: 4, isCool: true })).toThrow(/type/)
        })

        it('throws an error when the `create` method is tried without a database connection', () => {
          expect(Player.create({ name: 'Pedro', age: 3, isCool: true })).rejects.toThrow(/connect/)
        })

        it('throws an error when a type is set to a non-schema compatible value', () => {
          const player = new Player({ name: 'Pedro', age: 4 })
          // @ts-ignore : check static error -> runtime error
          expect(() => { player.age = 'four' }).toThrow(/type/)
          expect(player.age).not.toBe('four')
        })
      })
    })

    describe('enum', () => {
      const className = 'User'
      const schema = {
        username: Schema.string,
        role: Schema.enum(['admin', 'regular']),
      }

      const User = ActiveClass(className, schema)

      describe('happy path', () => {
        it('allows instantiation with a value from the array', () => {
          const user = new User({ username: 'Test', role: 'regular' })
          expect(user.role).toBe('regular')
        })

        it('can take a default', () => {
          const schema = {
            flavour: Schema.enum(['salty', 'sweet'], { default: 'salty' })
          }
          const Popcorn = ActiveClass('Popcorn', schema)

          const popcorn = new Popcorn({})
          expect(popcorn.flavour).toBe('salty')
        })

        it('can be optional', () => {
          const schema = {
            name: Schema.enum(['river', 'ocean'], { optional: true })
          }
          const River = ActiveClass('River', schema)

          const river = new River({})
          expect(river.name).toBeUndefined()
        })

        it('can take both strings and numbers', () => {
          const schema = {
            value: Schema.enum([1, 2, 'many'])
          }

          const Number = ActiveClass('Number', schema)
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
            const Popcorn = ActiveClass('Popcorn', {
              flavour: Schema.enum(['salty', 'sweet'], { default: 'salt' })
            })
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
      const userClassName = 'User'
      const userSchema = {
        username: Schema.string,
        friends: Schema.indexed.string,
        numbers: Schema.indexed.enum([1, 2, 3])
      }
      const User = ActiveClass(userClassName, userSchema)

      const otherClassName = 'Other'
      const otherSchema = {
        keys: Schema.indexed.boolean,
        counts: Schema.indexed.number
      }
      const Other = ActiveClass(otherClassName, otherSchema)

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
      const className = 'Venue'
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

      const Venue = ActiveClass(className, schema)

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