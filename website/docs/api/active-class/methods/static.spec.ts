import { ActiveClass, Schema, initialize } from '../../../../../src'
import { testDatabase } from '../../../../../src/utils/setupTestServer'
import testExpectError from '../../../../../src/utils/testExpectError';
import ActiveClassError from '../../../../../src/ActiveClass/Error';

const { databaseURL } = testDatabase()

const app = initialize({ databaseURL })

afterAll(async (done) => {
  await app.delete()
  done()
})

const schema = {
  name: Schema.string,
  age: Schema.number
}

class Person extends ActiveClass(schema) {}

test('Basic functions', () => {
  expect(typeof Person.create).toBe('function')
  expect(typeof Person.find).toBe('function')
  expect(typeof Person.update).toBe('function')
  expect(typeof Person.delete).toBe('function')
})

describe('Basic CRUD methods', () => {
  describe('#create', () => {
    test('Happy path', async (done) => {
      const helen = await Person.create({ name: 'Helen', age: 27 })
      expect(helen.name).toBe('Helen')
      expect(helen.age).toBe(27)
      done()
    })

    testExpectError('Missing property', async () => {
      // @ts-ignore
      await Person.create({ name: 'Helen' })
    }, {
        message: `Could not create Person. The required property 'age' is missing`,
        constructor: ActiveClassError
    })

    testExpectError('Wrong property type', async () => {
      // @ts-ignore
      await Person.create({ name: 'Helen', age: '27' })
    }, {
        message: `Could not create Person. The property 'age' is of the wrong type`,
        constructor: ActiveClassError
    })
  })

  describe('#delete', () => {
    beforeAll(async (done) => {
      await Person.delete({})
      await Person.create({ name: 'Harry', age: 40 })
      await Person.create({ name: 'Hermione', age: 41 })
      await Person.create({ name: 'Ron', age: 40 })
      done()
    })

    test('Happy path', async (done) => {
      const delete40 = await Person.delete({ age: 40 })
      expect(delete40).toBe(2)
      const deleteHarry = await Person.delete({ name: 'Harry' })
      expect(deleteHarry).toBe(0)
      const deleteRest = await Person.delete({})
      expect(deleteRest).toBe(1)
      done()
    })
  })

  describe('#deleteOne', () => {
    beforeAll(async (done) => {
      await Person.delete({})
      done()
    })

    test('Happy path', async (done) => {
      await Person.create({ name: 'Harry', age: 40 })
      await Person.create({ name: 'Hermione', age: 41 })

      const deleteHarry = await Person.deleteOne({ name: 'Harry' })
      expect(deleteHarry).toBe(true)

      const deleteRon = await Person.deleteOne({ name: 'Ron' })
      expect(deleteRon).toBe(false)

      const delete40 = await Person.deleteOne({ age: 40 })
      expect(delete40).toBe(false)
      done()
    })
  })

  describe('#find', () => {
    beforeAll(async (done) => {
      await Person.delete({})
      done()
    })

    test('Happy path', async (done) => {
      await Person.create({ name: 'Harry', age: 40 })
      await Person.create({ name: 'Hermione', age: 41 })
      await Person.create({ name: 'Ron', age: 40 })

      const aged40 = await Person.find({ age: 40 })
      expect(aged40[0].name).toBe('Harry')
      expect(aged40[1].name).toBe('Ron')
      done()
    })
  })
})

