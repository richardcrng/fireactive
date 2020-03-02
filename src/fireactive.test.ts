import { modelRecord } from './fireactive'
import Schema from './Schema'


describe('record', () => {
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
      const PlayerRecord = modelRecord(modelName, schema)

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
    })
  })
})


