import { createORM, schematise } from './fireactive'
import { SchemaShorthand } from './types/schema.types'

describe('schematise', () => {
  it("converts shorthand into longhand", () => {
    const schema = {
      name: String,
      isHost: Boolean
    }

    expect(schematise(schema)).toEqual({
      name: {
        type: String
      },
      isHost: {
        type: Boolean
      }
    })
  })

  it("converts partial shorthand into longhand", () => {
    const schema = {
      name: {
        type: String
      },
      isHost: Boolean
    }

    expect(schematise(schema)).toEqual({
      name: {
        type: String
      },
      isHost: {
        type: Boolean
      }
    })
  })
})

describe('createORM', () => {
  describe("GIVEN a table name of 'players' and a schema", () => {
    const tableName = 'players'
    const schema = {
      name: String,
      isHost: {
        type: Boolean,
        default: false
      },
      isReady: {
        type: Boolean,
        default: false
      }
    }

    describe("WHEN the table name and schema are passed to createORM", () => {
      const PlayerBase = createORM(tableName, schema)

      test("THEN the result is a class that can create new instances", () => {
        const player = PlayerBase.new({ name: 'Pedro' })
        expect(player.name).toBe('Pedro')
        expect(player.isHost).toBe(schema.isHost.default)
        expect(player.isReady).toBe(schema.isReady.default)
      })

      // test("AND the result throws an error when required properties are not passed", () => {
      //   expect(() => {
      //     const player = new PlayerBase()
      //   }).toThrowError()
      // })
    })
  })
})


