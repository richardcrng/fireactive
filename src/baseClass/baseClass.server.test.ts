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
      let player: InstanceType<typeof Player>
      let dbVals: any
      const createData = { name: 'Jorge', age: 42 }

      it('returns the created record', async (done) => {
        player = await Player.create(createData)
        expect(player.name).toBe('Jorge')
        expect(player.age).toBe(42)
        done()
      })

      it('creates an id for the player', () => {
        expect(player._id).toBeDefined()
      })

      it('creates a table for the relevant class based on the class key property', async (done) => {
        dbVals = await server.getValue()
        expect(dbVals).toHaveProperty(Player.key)
        done()
      })

      it('inserts the relevant data into the table', () => {
        expect(dbVals[Player.key]).toMatchObject({
          [player._id as string]: createData
        })
      })
      
      it('throws an error if params passed do not fit the schema', () => {
        // @ts-ignore : check that static error -> thrown error
        expect(Player.create({ name: 42, age: 42 })).rejects.toThrow(/type/)
      })

    })


  })
})