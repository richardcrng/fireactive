import baseClass from '.';
import Schema from '../Schema';
import pushWithId from '../utils/pushWithId';
import setupTestServer from '../utils/setupTestServer';

describe('baseClass: with server connection', () => {
  const { server, db } = setupTestServer()

  const className = 'Player'
  const schema = {
    name: Schema.string,
    age: Schema.number
  }
  const Player = baseClass(className, schema)
  let player: InstanceType<typeof Player>
  let dbVals: any

  describe('class methods', () => {
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

    describe('#update', () => {
      let res: InstanceType<typeof Player>[]
      let idOne: string, idTwo: string, idThree: string
      beforeAll(async (done) => {
        await db.ref(Player.key).set({})
        idOne = await pushWithId(db.ref(Player.key), { name: 'Alfred', age: 39 })
        idTwo = await pushWithId(db.ref(Player.key), { name: 'Martha', age: 12 })
        idThree = await pushWithId(db.ref(Player.key), { name: 'Alfred', age: 11 })
        res = await Player.update({ name: 'Alfred' }, { age: 40 })
        done()
      })

      it('returns an array of records that are updated', async (done) => {
        expect(res).toHaveLength(2)
        expect(idOne).not.toBe(idThree)
        expect(res[0]._id).toBe(idOne)
        expect(res[0]).toMatchObject({ name: 'Alfred', age: 40 })
        expect(res[1]._id).toBe(idThree)
        expect(res[1]).toMatchObject({ name: 'Alfred', age: 40 })
        done()
      })

      it('updates only the underlying database entries', async (done) => {
        const [entryOne, entryTwo, entryThree] = await Promise.all([
          server.getValue(db.ref(Player.key).child(idOne)),
          server.getValue(db.ref(Player.key).child(idTwo)),
          server.getValue(db.ref(Player.key).child(idThree))
        ])
        expect(entryOne).toMatchObject({ name: 'Alfred', age: 40 })
        expect(entryTwo).toMatchObject({ name: 'Martha', age: 12 })
        expect(entryThree).toMatchObject({ name: 'Alfred', age: 40 })
        done()
      })

      it('returns an empty array if no records match', async (done) => {
        const players = await Player.update({ name: 'mickey', age: 39 }, { age: 10 })
        expect(players).toEqual([])
        done()
      })
    })

    describe('#updateOne', () => {
      let res: InstanceType<typeof Player> | null
      let idOne: string, idTwo: string, idThree: string
      beforeAll(async (done) => {
        await db.ref(Player.key).set({})
        idOne = await pushWithId(db.ref(Player.key), { name: 'Alfred', age: 39 })
        idTwo = await pushWithId(db.ref(Player.key), { name: 'Martha', age: 12 })
        idThree = await pushWithId(db.ref(Player.key), { name: 'Alfred', age: 11 })
        res = await Player.updateOne({ name: 'Alfred' }, { age: 40 })
        done()
      })

      it('returns the updated record', async (done) => {
        expect(res?._id).toBe(idOne)
        expect(res?._id).not.toBe(idThree)
        expect(res).toMatchObject({ name: 'Alfred', age: 40 })
        done()
      })

      it('updates only the underlying database entry', async (done) => {
        const [entryOne, entryTwo, entryThree] = await Promise.all([
          server.getValue(db.ref(Player.key).child(idOne)),
          server.getValue(db.ref(Player.key).child(idTwo)),
          server.getValue(db.ref(Player.key).child(idThree))
        ])
        expect(entryOne).toMatchObject({ name: 'Alfred', age: 40 })
        expect(entryTwo).toMatchObject({ name: 'Martha', age: 12 })
        expect(entryThree).toMatchObject({ name: 'Alfred', age: 11 })
        done()
      })

      it('returns null if no records match', async (done) => {
        const players = await Player.updateOne({ name: 'mickey', age: 39 }, { age: 10 })
        expect(players).toBeNull()
        done()
      })
    })
  })

  describe('instance methods', () => {
    describe('.reload', () => {
      let res: any
      beforeAll(async (done) => {
        player = await Player.create({ name: 'Muriel', age: 7 })
        await db.ref(Player.key).child(player._id as string).set({ name: 'Jerry', age: 12 })
        res = await player.reload()
        done()
      })

      it('reloads the player from the database', async (done) => {
        expect(res).toMatchObject({ name: 'Jerry', age: 12 })
        expect(player).toMatchObject({ name: 'Jerry', age: 12 })
        done()
      })
    })

    describe('.save', () => {
      let res: any
      beforeAll(async (done) => {
        player = await Player.create({ name: 'Muriel', age: 7 })
        player.name = 'Jerry'
        player.age = 12
        res = await player.save()
        done()
      })

      it('updates any modified schema properties in the database', async (done) => {
        const playerInDb = await server.getValue(db.ref(Player.key).child(player._id as string))
        expect(playerInDb).toMatchObject({ name: 'Jerry', age: 12 })
        expect(res).toMatchObject(playerInDb)
        done()
      })
    })

    describe('.saveAndSync', () => {
      let res: any
      let playerRef: firebase.database.Reference
      beforeAll(async (done) => {
        player = await Player.create({ name: 'Muriel', age: 7 })
        playerRef = db.ref(Player.key).child(player._id as string)
        player.name = 'Jerry'
        player.age = 12
        res = await player.saveAndSync()
        done()
      })

      it('updates any modified schema properties in the database', async (done) => {
        const playerInDb = await server.getValue(playerRef)
        expect(playerInDb).toMatchObject({ name: 'Jerry', age: 12 })
        expect(res).toMatchObject(playerInDb)
        done()
      })

      it('means the `ActiveRecord` syncs with changes in the database', async (done) => {
        await playerRef.update({ name: 'Muriel again' })
        expect(player.name).toBe('Muriel again')
        done()
      })
    })

    describe('.syncIsOn', () => {
      beforeAll(async (done) => {
        player = await Player.create({ name: 'Michel', age: 78 })
        done()
      })

      it('returns true by default', () => {
        expect(player.syncIsOn()).toBe(true)
      })

      it('can be toggled by toggleSync', () => {
        player.toggleSync()
        expect(player.syncIsOn()).toBe(false)
      })
    })

    describe('.syncOff', () => {
      let playerRef: firebase.database.Reference
      beforeAll(async (done) => {
        player = await Player.create({ name: 'Michel', age: 78 })
        playerRef = db.ref(Player.key).child(player._id as string)
        done()
      })

      it('flips off syncing if it is on', async (done) => {
        // it will be on by start thanks to create
        expect(player.syncIsOn()).toBe(true)
        expect(player.name).toBe('Michel')
        await playerRef.update({ name: 'loloa' })
        expect(player.name).toBe('loloa') // as syncing is on
        player.syncOff()
        expect(player.syncIsOn()).toBe(false)
        await playerRef.update({ name: 'jammy' })
        expect(player.name).toBe('loloa') // as syncing is off
        done()
      })

      it('keeps syncing off it is already off', async (done) => {
        // it will be off following the above test
        expect(player.syncIsOn()).toBe(false)
        player.syncOff()
        expect(player.syncIsOn()).toBe(false)
        await playerRef.update({ name: 'fwefewfew' })
        expect(player.name).not.toBe('fwefewfew') // as syncing is off
        done()
      })
    })

    describe('.syncOn', () => {
      let playerRef: firebase.database.Reference
      beforeAll(async (done) => {
        player = await Player.create({ name: 'Michel', age: 78 })
        playerRef = db.ref(Player.key).child(player._id as string)
        done()
      })

      it('keeps syncing on it is already on', async (done) => {
        // it will be on by start thanks to create
        expect(player.syncIsOn()).toBe(true)
        player.syncOn()
        expect(player.syncIsOn()).toBe(true)
        await playerRef.update({ name: 'fwefewfew' })
        expect(player.name).toBe('fwefewfew') // as syncing is on
        done()
      })

      it('flips on syncing if it is off', async (done) => {
        player.syncOff()
        expect(player.syncIsOn()).toBe(false)
        await playerRef.update({ name: 'loloa' })
        expect(player.name).not.toBe('loloa') // as syncing is off
        player.syncOn()
        expect(player.syncIsOn()).toBe(true)
        await playerRef.update({ name: 'jammy' })
        expect(player.name).toBe('jammy') // as syncing is on
        done()
      })
    })

    describe('.syncOpts', () => {
      it("when initialized through `new`, shows all syncing as off", () => {
        const player = new Player({ name: 'Bob', age: 2 })
        expect(player.syncOpts()).toMatchObject({ fromDb: false, toDb: false })
      })

      it('when initialized through `create`, shows all syncing as true', async (done) => {
        const player = await Player.create({ name: 'Bob', age: 2 })
        expect(player.syncOpts()).toMatchObject({ fromDb: true, toDb: true })
        done()
      })
    })

    describe('.toggleSync', () => {
      beforeAll(async (done) => {
        player = await Player.create({ name: 'Michel', age: 78 })
        const playerRef = db.ref(Player.key).child(player._id as string)
        await playerRef.update({ name: 'Bobo' })
        player.toggleSync()
        await playerRef.update({ age: 4 })
        done()
      })

      it('stops properties being synced', () => {
        expect(player.name).toBe('Bobo') // before toggled sync
        expect(player.age).toBe(78) // after toggled sync
      })
    })
  })
})