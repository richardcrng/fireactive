import ActiveClass from '.';
import Schema from '../Schema';
import pushWithId from '../utils/pushWithId';
import setupTestServer from '../utils/setupTestServer';
import '../utils/toContainObject'
import ActiveClassError from './Error';

describe('ActiveClass: with server connection', () => {
  const { server, db } = setupTestServer()

  const playerSchema = {
    name: Schema.string,
    age: Schema.number
  }
  class Player extends ActiveClass(playerSchema) {}
  let player: InstanceType<typeof Player>

  const superheroSchema = {
    allies: {
      marvel: {
        spiderman: Schema.boolean({ required: false })
      },
      dc: {
        batman: Schema.boolean({ required: false })
      }
    },
    powers: {
      flight: Schema.boolean({ required: false }),
      superStrength: Schema.boolean({ required: false })
    },
    collectibles: Schema.indexed.boolean
  }
  class SuperHero extends ActiveClass(superheroSchema) {}
  let superHero: InstanceType<typeof SuperHero>

  let dbVals: any

  describe('class methods/properties', () => {
    describe('#cache', () => {
      describe('no argument provided', () => {
        let playerOne: typeof player
        let playerTwo: typeof player

        beforeAll(async (done) => {
          await Player.ref().set({})
          playerOne = await Player.create({ name: 'First', age: 1 })
          playerTwo = await Player.create({ name: 'Second', age: 2 })
          done()
        })

        it('returns the object representing the table', async (done) => {
          const playerTable = await server.getValue(Player.ref())
          const cachedPlayers = await Player.cache()
          expect(cachedPlayers).toEqual(playerTable)
          expect(Player.cached).toBe(cachedPlayers)
          expect(cachedPlayers[playerOne.getId()]).toEqual(playerOne.toObject())
          expect(cachedPlayers[playerTwo.getId()]).toEqual(playerTwo.toObject())
          done()
        })

        it('automatically listens for changes in the table and updates the cache', async (done) => {
          await playerOne.ref().update({ age: 5 })
          expect(Player.cached[playerOne.getId()].age).toBe(5)
          done()
        })
      })

      describe('argument of `false` provided', () => {
        let playerOne: typeof player
        let playerTwo: typeof player

        beforeAll(async (done) => {
          await Player.ref().set({})
          playerOne = await Player.create({ name: 'First', age: 1 })
          playerTwo = await Player.create({ name: 'Second', age: 2 })
          done()
        })

        it('returns the object representing the table', async (done) => {
          const playerTable = await server.getValue(Player.ref())
          const cachedPlayers = await Player.cache(false)
          expect(cachedPlayers).toEqual(playerTable)
          expect(Player.cached).toBe(cachedPlayers)
          expect(cachedPlayers[playerOne.getId()]).toEqual(playerOne.toObject())
          expect(cachedPlayers[playerTwo.getId()]).toEqual(playerTwo.toObject())
          done()
        })

        it('does not automatically listen and update the cache', async (done) => {
          await playerOne.ref().update({ age: 5 })
          expect(Player.cached[playerOne.getId()].age).not.toBe(5)
          done()
        })
      })
    })

    describe('#cached (getter)', () => {
      let playerOne: typeof player
      let playerTwo: typeof player

      beforeAll(async (done) => {
        await Player.ref().set({})
        playerOne = await Player.create({ name: 'First', age: 1 })
        playerTwo = await Player.create({ name: 'Second', age: 2 })
        await Player.cache()
        done()
      })

      it('returns the object representing the cached table', async (done) => {
        const playerTable = await server.getValue(Player.ref())
        const cachedPlayers = Player.cached
        expect(cachedPlayers).toEqual(playerTable)
        expect(cachedPlayers[playerOne.getId()]).toEqual(playerOne.toObject())
        expect(cachedPlayers[playerTwo.getId()]).toEqual(playerTwo.toObject())
        done()
      })
    })

    describe('#create', () => {
      describe('simple data', () => {
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
            [player.getId()]: createData
          })
        })

        it('throws an error if params passed do not fit the schema', async (done) => {
          expect.assertions(2)
          try {
            // @ts-ignore : check that static error -> thrown error
            await Player.create({ name: 42, age: 42 })
          } catch (err) {
            expect(err).toBeInstanceOf(ActiveClassError)
            expect(err.message).toMatch("Could not create Player. The property 'name' is of the wrong type")
            done()
          }
        })
      })

      describe('nested, data', () => {
        it('can create a record with properties that are empty objects', async (done) => {
          superHero = await SuperHero.create({ allies: { marvel: {}, dc: {} }, powers: {}, collectibles: {} })
          expect(superHero.allies).toEqual({ marvel: {}, dc: {} })
          expect(superHero.powers).toEqual({})
          expect(superHero.collectibles).toEqual({})
          done()
        })

        it('listens by default for updates', async (done) => {
          await superHero.ref('powers/superStrength').set(true)
          await superHero.ref('allies/marvel').update({ spiderman: true })
          expect(superHero.powers).toEqual({ superStrength: true })
          expect(superHero.allies).toEqual({ marvel: { spiderman: true }, dc: {} })
          expect(superHero.collectibles).toEqual({})
          done()
        })

        it('reifies nested props', async (done) => {
          const reifiedHero = await SuperHero.findById(superHero.getId())
          expect(reifiedHero && reifiedHero.toObject()).toMatchObject(superHero.toObject())
          done()
        })
      })
    })

    describe('#delete', () => {
      const deleteData = { age: 39 }
      let res: number
      let keyOne: string, keyTwo: string, keyThree: string
      beforeAll(async (done) => {
        await Player.ref().set({})
        keyOne = await pushWithId(Player.ref(), { ...deleteData, name: 'Kev' })
        keyTwo = await pushWithId(Player.ref(), { name: 'Mev', age: 40 })
        keyThree = await pushWithId(Player.ref(), { ...deleteData, name: 'Bev' })
        res = await Player.delete(deleteData)
        done()
      })

      it('deletes matching players', async (done) => {
        const dbPlayers = await server.getValue(Player.ref())
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
        await pushWithId(Player.ref(), { name: 'mikeee', age: 42 })
        await Player.delete({})
        const players = await server.getValue(Player.ref())
        expect(players).toBeNull()
        done()
      })
    })

    describe('#deleteOne', () => {
      const deleteData = { age: 39 }
      let res: boolean
      let keyOne: string, keyTwo: string, keyThree: string
      beforeAll(async (done) => {
        await Player.ref().set({})
        keyOne = await pushWithId(Player.ref(), { ...deleteData, name: 'Kev' })
        keyTwo = await pushWithId(Player.ref(), { name: 'Mev', age: 40 })
        keyThree = await pushWithId(Player.ref(), { ...deleteData, name: 'Bev' })
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
        await pushWithId(Player.ref(), createData)
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

      it('can handle reifying with empty object properties', async (done) => {
        const playerSchema = {
          name: Schema.string({ required: true }),
          alignment: Schema.enum(['mafia', 'town'], { required: false }),
          votedBy: Schema.indexed.boolean,
          votingFor: Schema.string({ required: false }),
        }

        class Player extends ActiveClass(playerSchema) {}

        await Player.ref().set(null)

        const richard = await Player.create({ name: 'Richard', votedBy: {} })
        const sai = await Player.create({ name: 'Sai', votedBy: {} })
        const alex = await Player.create({ name: 'Alex', votedBy: {} })

        const result = await Player.find({})
        expect(result).toHaveLength(3)
        expect(result).toContainObject(richard.toObject())
        expect(result).toContainObject(sai.toObject())
        expect(result).toContainObject(alex.toObject())
        done()
      })
    })

    describe('#findById', () => {
      const createData = { name: 'Alfred', age: 39 }
      let id: string
      beforeAll(async (done) => {
        id = await pushWithId(Player.ref(), createData)
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
        await pushWithId(Player.ref(), createDataOne)
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

    describe('#ref', () => {
      it('returns the ref for the table when no argument is supplied', () => {
        expect(Player.ref()).toEqual(Player.ref())
      })

      it('returns the ref for the child when argument is supplied', () => {
        expect(Player.ref('random')).toEqual(Player.ref().child('random'))
      })
    })

    describe('#update', () => {
      let res: InstanceType<typeof Player>[]
      let idOne: string, idTwo: string, idThree: string
      beforeAll(async (done) => {
        await Player.ref().set({})
        idOne = await pushWithId(Player.ref(), { name: 'Alfred', age: 39 })
        idTwo = await pushWithId(Player.ref(), { name: 'Martha', age: 12 })
        idThree = await pushWithId(Player.ref(), { name: 'Alfred', age: 11 })
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
          server.getValue(Player.ref().child(idOne)),
          server.getValue(Player.ref().child(idTwo)),
          server.getValue(Player.ref().child(idThree))
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
        await Player.ref().set({})
        idOne = await pushWithId(Player.ref(), { name: 'Alfred', age: 39 })
        idTwo = await pushWithId(Player.ref(), { name: 'Martha', age: 12 })
        idThree = await pushWithId(Player.ref(), { name: 'Alfred', age: 11 })
        res = await Player.updateOne({ name: 'Alfred' }, { age: 40 })
        done()
      })

      it('returns the updated record', async (done) => {
        expect(res && res._id).toBe(idOne)
        expect(res && res._id).not.toBe(idThree)
        expect(res).toMatchObject({ name: 'Alfred', age: 40 })
        done()
      })

      it('updates only the underlying database entry', async (done) => {
        const [entryOne, entryTwo, entryThree] = await Promise.all([
          server.getValue(Player.ref().child(idOne)),
          server.getValue(Player.ref().child(idTwo)),
          server.getValue(Player.ref().child(idThree))
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
    describe('.pendingSetters', () => {
      let mary: InstanceType<typeof Player>
      beforeAll(async (done) => {
        mary = await Player.create({ name: 'Mary', age: 0 })
        for (let i = 1; i <= 100; i++) {
          mary.age = i
        }
        done()
      })

      it('returns an array of all pending setters when passed in the array option', () => {
        expect(mary.pendingSetters({ array: true })).toHaveLength(100)
      })

      it('returns a promise when passed no arguments', () => {
        expect(mary.pendingSetters()).toHaveProperty('then')
      })

      it('returns an empty array when passed the array option and all promises are resolved', async (done) => {
        await mary.pendingSetters()
        expect(mary.pendingSetters({ array: true })).toEqual([])
        expect(mary.age).toBe(100)
        const maryOnServer = await server.getValue(Player.ref().child(mary.getId()))
        expect(maryOnServer.age).toBe(100)
        done()
      })
    })

    describe('.reload', () => {
      let res: any
      beforeAll(async (done) => {
        player = await Player.create({ name: 'Muriel', age: 7 })
        await Player.ref().child(player._id as string).set({ name: 'Jerry', age: 12 })
        res = await player.reload()
        done()
      })

      it('reloads the player from the database', async (done) => {
        expect(res).toMatchObject({ name: 'Jerry', age: 12 })
        expect(player).toMatchObject({ name: 'Jerry', age: 12 })
        done()
      })
    })

    describe('.ref', () => {
      let player: InstanceType<typeof Player>
      beforeAll(async (done) => {
        player = await Player.create({ name: 'AFEFE', age: 20 })
        done()
      })

      it('returns the ref for the record when no argument is supplied', () => {
        expect(player.ref()).toEqual(Player.ref().child(player.getId()))  
      })

      it('returns the ref for a child of the record when an argument is supplied', () => {
        expect(player.ref('name')).toEqual(Player.ref().child(player.getId()).child('name'))
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
        const playerInDb = await server.getValue(Player.ref().child(player._id as string))
        expect(playerInDb).toMatchObject({ name: 'Jerry', age: 12 })
        expect(res).toMatchObject(playerInDb)
        done()
      })
    })

    describe('.saveAndSync', () => {
      let res: any
      let playerRef: firebase.database.Reference

      describe('no arguments provided', () => {
        beforeAll(async (done) => {
          player = new Player({ name: 'Muriel', age: 7 })
          playerRef = Player.ref().child(player.getId())
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

        it('updates the syncOpts so both are true', () => {
          expect(player.syncOpts()).toMatchObject({ fromDb: true, toDb: true })
        })

        it('means the `ActiveRecord` syncs changes from the database', async (done) => {
          await playerRef.update({ name: 'Muriel again' })
          expect(player.name).toBe('Muriel again')
          done()
        })

        it('means the `ActiveRecord` syncs changes to the database', async (done) => {
          player.name = 'No longer Muriel'
          await player.pendingSetters()
          const playerInDb = await server.getValue(Player.ref().child(player.getId()))
          expect(playerInDb.name).toBe('No longer Muriel')
          done()
        })
      })

      describe('syncOpts provided', () => {
        describe('toDb: false', () => {
          beforeAll(async (done) => {
            player = new Player({ name: 'Malo', age: 4 })
            playerRef = Player.ref().child(player.getId())
            player.age = 10
            await player.saveAndSync({ toDb: false })
            done()
          })

          it("saves changes to db", async (done) => {
            const playerInDb = await server.getValue(playerRef)
            expect(playerInDb.name).toBe('Malo')
            expect(playerInDb.age).toBe(10)
            done()
          })

          it('updates the syncOpts saved', () => {
            expect(player.syncOpts().toDb).toBe(false)
          })

          it("doesn't sync further sets to db automatically", async (done) => {
            player.age = 11
            await player.pendingSetters()
            const playerInDb = await server.getValue(player.ref())
            expect(playerInDb.age).not.toBe(11)
            done()
          })
        })

        describe('fromDb: false', () => {
          beforeAll(async (done) => {
            player = new Player({ name: 'Malo', age: 4 })
            playerRef = Player.ref().child(player.getId())
            player.age = 10
            await player.saveAndSync({ fromDb: false })
            done()
          })

          it("saves changes to db", async (done) => {
            const playerInDb = await server.getValue(playerRef)
            expect(playerInDb.name).toBe('Malo')
            expect(playerInDb.age).toBe(10)
            done()
          })

          it('updates the syncOpts saved', () => {
            expect(player.syncOpts().fromDb).toBe(false)
          })

          it("doesn't sync further db updates automatically", async (done) => {
            await player.ref().update({ age: 11 })
            expect(player.age).not.toBe(11)
            done()
          })
        })
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

      it('can update the sync options for a player', async (done) => {
        const playerOne = await Player.create({ name: 'Bob', age: 2 })
        const playerTwo = await Player.create({ name: 'Bob', age: 2 })
        const optsOne = playerOne.syncOpts({ fromDb: false })
        const optsTwo = playerTwo.syncOpts({ toDb: false })
        expect(optsOne).toMatchObject({ fromDb: false, toDb: true })
        expect(optsTwo).toMatchObject({ fromDb: true, toDb: false })
        done()
      })

      describe('.syncOpts().fromDb', () => {
        it('when true, means db changes sync to the record', async (done) => {
          const player = await Player.create({ name: 'Bob', age: 2 })
          expect(player.syncOpts().fromDb).toBe(true)
          expect(player.name).toBe('Bob')
          await player.ref().update({ name: 'Lola' })
          expect(player.name).toBe('Lola')
          done()
        })

        it('when false, means db changes do not sync to the record', async (done) => {
          const player = await Player.create({ name: 'Bob', age: 2 })
          expect(player.syncOpts({ fromDb: false }).fromDb).toBe(false)
          expect(player.name).toBe('Bob')
          await player.ref().update({ name: 'Lola' })
          expect(player.name).toBe('Bob')
          done()
        })
      })

      describe('.syncOpts().toDb', () => {
        it('when true, means record changes sync to the db', async (done) => {
          const player = await Player.create({ name: 'Bob', age: 2 })
          expect(player.syncOpts().toDb).toBe(true)
          expect(player.name).toBe('Bob')
          player.name = 'Lola'
          await player.pendingSetters()
          const serverPlayer = await server.getValue(player.ref())
          expect(serverPlayer.name).toBe('Lola')
          done()
        })

        it('does not sync non-fitting schema values', async (done) => {
          const player = await Player.create({ name: 'Bob', age: 2 })
          expect(player.name).toBe('Bob')
          // @ts-ignore : check static error -> runtime error
          expect(() => { player.name = 4 }).toThrow(/type/)
          await player.pendingSetters()
          const serverPlayer = await server.getValue(player.ref())
          expect(serverPlayer.name).not.toBe(4)
          done()
        })

        it('when false, means record changes do not sync to thedb', async (done) => {
          const player = await Player.create({ name: 'Bob', age: 2 })
          expect(player.syncOpts({ toDb: false }).toDb).toBe(false)
          expect(player.name).toBe('Bob')
          player.name = 'Lola'
          await player.pendingSetters()
          const serverPlayer = await server.getValue(player.ref())
          expect(serverPlayer.name).toBe('Bob')
          done()
        })
      })
    })
  })
})