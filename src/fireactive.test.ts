import { createORM } from './fireactive'
import Schema from './Schema'


describe('createORM', () => {
  describe("GIVEN a table name of 'players' and a schema", () => {
    const tableName = 'players'
    const schema = {
      name: Schema.string,
      age: Schema.number,
      friends: Schema.number(),
      children: Schema.number({ default: 4 }),
      parents: Schema.number({ optional: true })
    }

    describe("WHEN the table name and schema are passed to createORM", () => {
      const PlayerBase = createORM(tableName, schema)

      test("THEN the result is a class that can create new instances", () => {
        const player = new PlayerBase({ name: 'Pedro', age: 3, friends: 4 })
        expect(player.name).toBe('Pedro')
      })
    })
  })
})


