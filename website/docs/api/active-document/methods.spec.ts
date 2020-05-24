import { ActiveClass, Schema, initialize } from '../../../../src'
import { testDatabase } from '../../../../src/utils/setupTestServer'
import testExpectError from '../../../../src/utils/testExpectError';
import ActiveClassError from '../../../../src/ActiveClass/Error';

const { databaseURL, server } = testDatabase()

const schema = {
  name: Schema.string,
  age: Schema.number
}

class Person extends ActiveClass(schema) { }

test('Basic functions', () => {
  expect(typeof Person.create).toBe('function')
  expect(typeof Person.find).toBe('function')
  expect(typeof Person.update).toBe('function')
  expect(typeof Person.delete).toBe('function')
})

describe('Without initializing', () => {
  const ariana = new Person({ name: 'Ariana', age: 24 })

  testExpectError('cannot save', async () => {
    await ariana.save()
  }, {
    message: `Failed to save Person into database. Could not connect to your Firebase database. This might be because you have not initialized your Firebase app. Try calling Fireactive.initialize`,
    constructor: ActiveClassError
  })
})

describe('After initializing', () => {
  let app: firebase.app.App

  beforeAll(() => {
    app = initialize({ databaseURL })
  })

  afterAll(async (done) => {
    await app.delete()
    done()
  })

  describe('.getId', () => {
    it("generates an id when one doesn't exist", () => {
      const ariana = new Person({ name: 'Ariana', age: 24 })
      expect(ariana._id).toBeUndefined()
      expect(typeof ariana.getId()).toBe('string')
      expect(ariana._id).toBe(ariana.getId())
    })

    it("returns the _id when it does exist", async (done) => {
      const taylor = await Person.create({ name: 'Taylor', age: 29 })
      expect(typeof taylor._id).toBe('string')
      expect(taylor._id).toBe(taylor.getId())
      done()
    })
  })

  describe('.reload', () => {
    it("refreshes properties from the database", async (done) => {
      const ariana = await Person.create({ name: 'Ariana', age: 24 })
      ariana.syncOpts({ fromDb: false })

      await ariana.ref().update({ age: 25 })
      expect(ariana.age).toBe(24)

      const reloaded = await ariana.reload()
      expect(reloaded).toMatchObject({ name: 'Ariana', age: 25 })
      expect(ariana.age).toBe(25)
      done()
    })
  })

  describe('.syncOpts', () => {
    describe('default settings', () => {
      describe(".create", () => {
        let ariana: Person
        beforeAll(async (done) => {
          ariana = await Person.create({ name: 'Ariana', age: 24 })
          done()
        })

        it("has both syncing to and from database on by default", () => {
          expect(ariana.name).toBe("Ariana")
          expect(ariana.age).toBe(24)
          expect(ariana.syncOpts()).toEqual({ fromDb: true, toDb: true })
        })

        it("successfully syncs changes TO database", async (done) => {
          ariana.age = 25
          await ariana.pendingSetters()
          const snapshot = await ariana.ref().once('value')
          expect(snapshot.val().age).toBe(25)
          done()
        })

        it("successfully syncs changes FROM database", async (done) => {
          await ariana.ref().update({ name: "Ms Grande" })
          expect(ariana.name).toBe("Ms Grande")
          done()
        })
      })

      describe("new", () => {
        let ariana: Person
        beforeAll(() => {
          ariana = new Person({ name: "Ariana", age: 24 })
        })

        it("has both syncing to and from database off by default", async (done) => {
          expect(ariana.name).toBe("Ariana")
          expect(ariana.age).toBe(24)
          expect(ariana.syncOpts()).toEqual({ fromDb: false, toDb: false })
          await ariana.save()
          expect(ariana.syncOpts()).toEqual({ fromDb: false, toDb: false })
          done()
        })

        it("does not sync changes TO database", async (done) => {
          ariana.age = 25
          await ariana.pendingSetters()
          const snapshot = await ariana.ref().once('value')
          expect(snapshot.val().age).toBe(24)
          done()
        })

        it("does not sync changes FROM database", async (done) => {
          await ariana.ref().update({ name: "Ms Grande" })
          expect(ariana.name).toBe("Ariana")
          done()
        })
      })
    })

    describe("updating settings", () => {
      describe('turning syncing off from db after a create', () => {
        let ariana: Person

        beforeAll(async (done) => {
          ariana = await Person.create({ name: "Ariana", age: 24 })
          done()
        })

        it("returns the updated settings when turning syncing off fromDb", () => {
          expect(ariana.syncOpts()).toEqual({ toDb: true, fromDb: true })
          expect(ariana.syncOpts({ fromDb: false })).toEqual({ toDb: true, fromDb: false })
        })

        it("actually stops syncing fromDb", async (done) => {
          await ariana.ref().update({ age: 25 })
          expect(ariana.age).toBe(24)
          done()
        })

        it("can fetch updates using reload", async (done) => {
          await ariana.reload()
          expect(ariana.age).toBe(25)
          done()
        })
      })
    })
  })
})

