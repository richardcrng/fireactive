import { createORM, Types, FieldIdentifier } from './fireactive'
import { SchemaShorthand } from './types/schema.types'

// describe('schematise', () => {
//   it("converts shorthand into longhand", () => {
//     const schema = {
//       name: String,
//       isHost: Boolean
//     }

//     expect(schematise(schema)).toEqual({
//       name: {
//         type: String
//       },
//       isHost: {
//         type: Boolean
//       }
//     })
//   })

//   it("converts partial shorthand into longhand", () => {
//     const schema = {
//       name: {
//         type: String,
//         optional: true
//       },
//       isHost: Boolean
//     }

//     expect(schematise(schema)).toEqual({
//       name: {
//         type: String,
//         optional: true
//       },
//       isHost: {
//         type: Boolean
//       }
//     })
//   })

//   it("handles nested sub-schemas", () => {
//     const schema = {
//       name: {
//         first: String,
//         last: {
//           type: String
//         }
//       }
//     }

//     expect(schematise(schema)).toEqual({
//       name: {
//         first: { type: String },
//         last: { type: String }
//       }
//     })
//   })
// })

describe('createORM', () => {
  describe("GIVEN a table name of 'players' and a schema", () => {
    const tableName = 'players'
    const schema = {
      name: Types.string,
      isHost: Types.boolean({ default: false }),
      isReady: Types.number({ required: false })
    }

    describe("WHEN the table name and schema are passed to createORM", () => {
      const PlayerBase = createORM(tableName, schema)

      test("THEN the result is a class that can create new instances", () => {
        const player = PlayerBase.new({ name: 'Pedro' })
        expect(player.name).toBe('Pedro')
        expect(player.isHost).toBe(false)
        expect(player.isReady).toBeUndefined()
      })

      // test("AND the result throws an error when required properties are not passed", () => {
      //   expect(() => {
      //     const player = new PlayerBase()
      //   }).toThrowError()
      // })
    })
  })
})


