import FirebaseServer from 'firebase-server'
import baseClass from '.';
import Schema from '../Schema';
import initialize from '../initialize';

describe('baseClass: integration test', () => {
  describe('integration with Schema', () => {
    test('non-nested schema', () => {
      const modelName = 'player'
      const schema = {
        name: Schema.string,
        age: Schema.number,
        isCool: Schema.boolean(),
        friends: Schema.number({ required: false }),
        children: Schema.number({ default: 4 }),
        parents: Schema.number({ optional: true })
      }

      const PlayerRecord = baseClass(modelName, schema)

      const player = new PlayerRecord({ name: 'Pedro', age: 3, isCool: true })
      expect(player.name).toBe('Pedro')
      expect(player.age).toBe(3)
      expect(player.isCool).toBe(true)
      expect(player.friends).toBeUndefined()
      expect(player.children).toBe(4)
      expect(player.parents).toBeUndefined()
    })

    test('nested schema', () => {
      const modelName = 'venue'
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

      const VenueRecord = baseClass(modelName, schema)
      const venue = new VenueRecord({ name: 'WeWork', hours: { openingTime: 4 }, status: {} })
      expect(venue.name).toBe('WeWork')
      expect(venue.hours.openingTime).toBe(4)
      expect(venue.hours.closingTime).toBe(20)
      expect(venue.status.isAccessible).toBeUndefined()
    })
  })

  describe('integration with Schema and server', () => {
    describe("GIVEN a model name of 'players' and a schema", () => {
      const modelName = 'player'
      const schema = {
        name: Schema.string,
        age: Schema.number,
        isCool: Schema.boolean(),
        friends: Schema.number({ required: false }),
        children: Schema.number({ default: 4 }),
        parents: Schema.number({ optional: true })
      }

      describe("WHEN the model name and schema are passed to record", () => {
        const PlayerRecord = baseClass(modelName, schema)

        test("THEN the result is a class that can create new instances", () => {
          const player = new PlayerRecord({ name: 'Pedro', age: 3, isCool: true })
          expect(player.name).toBe('Pedro')
          expect(player.age).toBe(3)
          expect(player.isCool).toBe(true)
          expect(player.friends).toBeUndefined()
          expect(player.children).toBe(4)
          expect(player.parents).toBeUndefined()
        })

        test("AND an error is thrown if required fields are not passed", () => {
          // @ts-ignore : checking for an error
          expect(() => new PlayerRecord({ age: 3 })).toThrow(/missing the required property/)
        })

        test("AND an error is thrown if a field is passed of the wrong type", () => {
          // @ts-ignore : checking for an error
          expect(() => new PlayerRecord({ name: 4, age: 3, isCool: true })).toThrow(/wrong type/)
        })

        test("AND using the model's create method throws an error without a database connection", () => {
          expect(PlayerRecord.create({ name: 'Pedro', age: 3, isCool: true })).rejects.toThrow('Cannot get Firebase Real-Time Database instance: have you intialised the Firebase connection?')
        })

        describe("AND a connection to a database is initialise", () => {
          let server: FirebaseServer

          beforeAll(async (done) => {
            server = new FirebaseServer(5555, 'localhost')
            initialize({
              databaseURL: `ws://localhost:${server.getPort()}`
            })
            done()
          })

          afterAll(async (done) => {
            await server.close()
            done()
          })

          test("THEN a model's create method does not throw an error", () => {
            expect(PlayerRecord.create({ name: 'Pedro', age: 3, isCool: true })).resolves.toMatchObject({
              name: 'Pedro',
              age: 3,
              isCool: true
            })
          })
        })
      })
    })
  })
})