import { baseClass, Schema } from './fireactive'
import setupTestServer from './utils/setupTestServer'

describe('baseClass', () => {
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
        expect(PlayerRecord.create({ name: 'Pedro', age: 3, isCool: true })).rejects.toThrow(/connect/)
      })

      describe("AND a connection to a database is initialise", () => {
        setupTestServer()

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


