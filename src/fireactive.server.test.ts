import { ActiveClass, Schema, initialize } from './fireactive'
import 'dotenv/config'
import sleep from './utils/sleep'

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

describe('CRUD', () => {
  let player: Player
  describe('Creating an entry', () => {
    test('Instantiating a valid `ActiveDocument`', async (done) => {
      player = await Player.create({ name: 'Pedro', age: 3, isCool: true })
      expect(player.name).toBe('Pedro')
      expect(player.age).toBe(3)
      expect(player.isCool).toBe(true)
      expect(player.friends).toBeUndefined()
      expect(player.children).toBe(4)
      expect(player.parents).toBeUndefined()
      done()
    })

    test('Checking the `ActiveDocument` against the database', async (done) => {
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

    describe('syncing', () => {
      it('fromDb is on by default', async (done) => {
        await player.ref().update({ children: 5 })
        await sleep(200)
        expect(player.children).toBe(5)
        done()
      })

      it('toDb is on by default', async (done) => {
        player.parents = 1
        await player.pendingSetters()
        const parentsSnapshot = await player.ref('parents').once('value')
        expect(parentsSnapshot.val()).toBe(1)
        done()
      })
    })
  })

  describe("Reading an entry", () => {
    it('can read a player by id', async (done) => {
      expect.assertions(1)
      const p = await Player.findById(player.getId())
      if (p) expect(p.toObject()).toEqual(player.toObject())
      done()
    })
  })
})