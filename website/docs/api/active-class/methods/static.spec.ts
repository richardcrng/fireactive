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
  describe('create', () => {
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
})

