import FirebaseServer from 'firebase-server'
import baseClass from '.';
import Schema from '../Schema';
import initialize from '../initialize';

describe('baseClass: with server connection', () => {
  let server: FirebaseServer
  let app: firebase.app.App
  let db: firebase.database.Database

  beforeAll(async (done) => {
    server = new FirebaseServer(0, 'localhost')
    const firebaseConfig = {
      databaseURL: `ws://localhost:${server.getPort()}`
    }
    app = initialize(firebaseConfig)
    db = app.database()
    done()
  })

  afterAll(async (done) => {
    await server.close()
    done()
  })

  describe('class methods', () => {
    const className = 'player'
    const schema = {
      name: Schema.string,
      age: Schema.number
    }
    const Player = baseClass(className, schema)
    let player: InstanceType<typeof Player>
    let dbVals: any

    describe('#create', () => {
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

    describe('#find', () => {
      const createData = { name: 'Alfred', age: 39 }
      beforeAll(async (done) => {
        await db.ref(Player.key).set({})
        await db.ref(Player.key).push(createData)
        done()
      })

      it('returns an array of records matching the props passed in', async (done) => {
        const players = await Player.find({ name: 'Alfred' })
        expect(players[0].name).toBe(createData.name)
        expect(players[0].age).toBe(createData.age)
        done()
      })

      it('returns an empty array if no records match', async (done) => {
        const players = await Player.find({ name: 'Alfred', age: 40 })
        expect(players).toEqual([])
        done()
      })
    })
  })
})