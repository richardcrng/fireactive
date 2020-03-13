import FirebaseServer from 'firebase-server'
import baseClass from '.';
import Schema from '../Schema';
import initialize from '../initialize';

describe('baseClass: with server connection', () => {
  let server: FirebaseServer

  beforeAll(async (done) => {
    server = new FirebaseServer(0, 'localhost')
    initialize({
      databaseURL: `ws://localhost:${server.getPort()}`
    })
    done()
  })

  afterAll(async (done) => {
    await server.close()
    done()
  })

  describe('class methods', () => {
    describe('#create', () => {
      const className = 'player'
      const schema = {
        name: Schema.string,
        age: Schema.number
      }
      const Player = baseClass(className, schema)

      it('returns the created player', async (done) => {
        const player = await Player.create({ name: 'Jorge', age: 42 })
        expect(player.name).toBe('Jorge')
        expect(player.age).toBe(42)
        done()
      })
      
      it('throws an error if params passed do not fit the schema', () => {
        // @ts-ignore : check that static error -> thrown error
        expect(Player.create({ name: 42, age: 42 })).rejects.toThrow(/type/)
      })

    })
  })
})