import FirebaseServer from 'firebase-server'
import baseClass from '.';
import Schema from '../Schema';
import initialize from '../initialize';
import pushWithId from '../utils/pushWithId';

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

    describe('#delete', () => {
      const deleteData = { age: 39 }
      let res: number
      let keyOne: string, keyTwo: string, keyThree: string
      beforeAll(async (done) => {
        await db.ref(Player.key).set({})
        keyOne = await pushWithId(db.ref(Player.key), { ...deleteData, name: 'Kev' })
        keyTwo = await pushWithId(db.ref(Player.key), { name: 'Mev', age: 40 })
        keyThree = await pushWithId(db.ref(Player.key), { ...deleteData, name: 'Bev' })
        res = await Player.delete(deleteData)
        done()
      })

      it('deletes matching players', async (done) => {
        const dbPlayers = await server.getValue(db.ref(Player.key))
        const remainingKeys = Object.keys(dbPlayers)
        expect(remainingKeys).toHaveLength(1)
        expect(remainingKeys).not.toContain(keyOne)
        expect(remainingKeys).toContain(keyTwo)
        expect(remainingKeys).not.toContain(keyThree)
        done()
      })

      it('returns the count of players deleted', () => {
        expect(res).toBe(2)
      })

      it('returns 0 if no players have been deleted', async (done) => {
        const res = await Player.delete({ age: 9 })
        expect(res).toBe(0)
        done()
      })

      it('deletes all if passed an empty object', async (done) => {
        await pushWithId(db.ref(Player.key), { name: 'mikeee', age: 42 })
        await Player.delete({})
        const players = await server.getValue(db.ref(Player.key))
        expect(players).toBeNull()
        done()
      })
    })

    describe('#deleteOne', () => {
      const deleteData = { age: 39 }
      let res: boolean
      let keyOne: string, keyTwo: string, keyThree: string
      beforeAll(async (done) => {
        await db.ref(Player.key).set({})
        keyOne = await pushWithId(db.ref(Player.key), { ...deleteData, name: 'Kev' })
        keyTwo = await pushWithId(db.ref(Player.key), { name: 'Mev', age: 40 })
        keyThree = await pushWithId(db.ref(Player.key), { ...deleteData, name: 'Bev' })
        res = await Player.deleteOne(deleteData)
        done()
      })

      it('deletes at most only one entry', async (done) => {
        const dbVals = await server.getValue()
        const remainingKeys = Object.keys(dbVals[Player.key])
        expect(remainingKeys).toHaveLength(2)
        expect(remainingKeys).not.toContain(keyOne)
        expect(remainingKeys).toContain(keyTwo)
        expect(remainingKeys).toContain(keyThree)
        done()
      })

      it('returns true if an entry has been deleted', () => {
        expect(res).toBe(true)
      })

      it('returns false if no entry has been deleted', async (done) => {
        const res = await Player.deleteOne({ age: 1002 })
        expect(res).toBe(false)
        done()
      })
    })

    describe('#find', () => {
      const createData = { name: 'Alfred', age: 39 }
      beforeAll(async (done) => {
        await pushWithId(db.ref(Player.key), createData)
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

    describe('#findById', () => {
      const createData = { name: 'Alfred', age: 39 }
      let id: string
      beforeAll(async (done) => {
        id = await pushWithId(db.ref(Player.key), createData)
        done()
      })

      it('finds a record that matches the id', async (done) => {
        const player = await Player.findById(id) as InstanceType<typeof Player>
        expect(player._id).toBe(id)
        expect(player.name).toBe(createData.name)
        expect(player.age).toBe(createData.age)
        done()
      })

      it('returns null if there is no matching record', async (done) => {
        const player = await Player.findById('this is definitely not a valid id, as if')
        expect(player).toBeNull()
        done()
      })
    })

    describe('#findOne', () => {
      const createDataOne = { name: 'Billybo', age: 29 }
      const createDataTwo = { name: 'Cassanda', age: 29 }
      beforeAll(async (done) => {
        await pushWithId(db.ref(Player.key), createDataOne)
        done()
      })

      it('finds the first record that matches the data', async (done) => {
        const player = await Player.findOne({ age: 29 }) as InstanceType<typeof Player>
        expect(player.name).toBe(createDataOne.name)
        expect(player.name).not.toBe(createDataTwo.name)
        done()
      })

      it('returns null if there is no matching record', async (done) => {
        const player = await Player.findOne({ age: 30 })
        expect(player).toBeNull()
        done()
      })
    })
  })
})