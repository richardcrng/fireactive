import { ActiveClass, Schema, initialize } from './fireactive'
import 'dotenv/config'

const schema = {
  name: Schema.string,
  age: Schema.number,
  isCool: Schema.boolean(),
  friends: Schema.number({ required: false }),
  children: Schema.number({ default: 4 }),
  parents: Schema.number({ optional: true })
}

class Player extends ActiveClass(schema) {}

const app = initialize({
  databaseURL: process.env.DATABASE_URL
})

const db = app.database()

beforeAll(async (done) => {
  await db.ref().remove()
  done()
})

afterAll(async (done) => {
  await app.delete()
  done()
})

describe('Creating an entry', () => {
  let player: Player
  test('Instantiating a valid `ActiveRecord`', async (done) => {
    player = await Player.create({ name: 'Pedro', age: 3, isCool: true })
    expect(player.name).toBe('Pedro')
    expect(player.age).toBe(3)
    expect(player.isCool).toBe(true)
    expect(player.friends).toBeUndefined()
    expect(player.children).toBe(4)
    expect(player.parents).toBeUndefined()
    done()
  })

  test('Checking the `ActiveRecord` against the database', async (done) => {
    const playerSnapshot = await player.ref().once('value')
    const playerInDb = playerSnapshot.val()
    expect(playerInDb.name).toBe('Pedro')
    expect(playerInDb.age).toBe(3)
    expect(playerInDb.isCool).toBe(true)
    expect(playerInDb.friends).toBeUndefined()
    expect(playerInDb.children).toBe(4)
    expect(playerInDb.parents).toBeUndefined()
    done()
  })
})