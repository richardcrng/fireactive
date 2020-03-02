import { modelRecord } from './fireactive'
import Schema from './Schema'


describe('record', () => {
  describe("GIVEN a table name of 'players' and a schema", () => {
    const tableName = 'players'
    const schema = {
      name: Schema.string,
      age: Schema.number,
      isCool: Schema.boolean(),
      friends: Schema.number({ required: false }),
      children: Schema.number({ default: 4 }),
      parents: Schema.number({ optional: true })
    }

    describe("WHEN the table name and schema are passed to record", () => {
      const Player = modelRecord(tableName, schema)

      test("THEN the result is a class that can create new instances", () => {
        const player = new Player({ name: 'Pedro', age: 3, isCool: true })
        expect(player.name).toBe('Pedro')
        expect(player.age).toBe(3)
        expect(player.isCool).toBe(true)
        expect(player.friends).toBeUndefined()
        expect(player.children).toBe(4)
        expect(player.parents).toBeUndefined()
      })
    })
  })
})


