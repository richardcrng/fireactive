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
})

