import { ActiveClass, Schema, initialize } from './fireactive'
import 'dotenv/config'

describe('ActiveClass', () => {
  describe("GIVEN a model name of 'players' and a schema", () => {
    const schema = {
      name: Schema.string,
      age: Schema.number,
      isCool: Schema.boolean(),
      friends: Schema.number({ required: false }),
      children: Schema.number({ default: 4 }),
      parents: Schema.number({ optional: true })
    }

    describe("WHEN an `ActiveClass` is extended", () => {
      class Player extends ActiveClass(schema) { }

      describe("AND a connection to a database is initialised", () => {
        const app = initialize({
          databaseURL: process.env.DATABASE_URL
        })

        beforeAll(async (done) => {
          await app.database().ref().remove()
          done()
        })

        afterAll(async (done) => {
          await app.delete()
          done()
        })

        test("THEN a model's create method does not throw an error", () => {
          expect(Player.create({ name: 'Pedro', age: 3, isCool: true })).resolves.toMatchObject({
            name: 'Pedro',
            age: 3,
            isCool: true
          })
        })

      })
    })
  })
})


