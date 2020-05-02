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

  describe('#findById', () => {
    let harry: Person
    let hermione: Person
    beforeAll(async (done) => {
      await Person.delete({})
      harry = await Person.create({ name: 'Harry', age: 40 })
      hermione = await Person.create({ name: 'Hermione', age: 41 })
      done()
    })

    test('Happy path', async (done) => {
      const matchOne = await Person.findById(harry._id as string)
      const matchTwo = await Person.findById(hermione.getId())
      expect(matchOne && matchOne.name).toBe('Harry')
      expect(matchTwo && matchTwo.name).toBe('Hermione')
      done()
    })

    test('Null when no match', async (done) => {
      const matchThree = await Person.findById('this is a really implausible id')
      expect(matchThree).toBeNull()
      done()
    })
  })

  describe('#findByIdOrFail', () => {
    let harry: Person
    let hermione: Person
    beforeAll(async (done) => {
      await Person.delete({})
      harry = await Person.create({ name: 'Harry', age: 40 })
      hermione = await Person.create({ name: 'Hermione', age: 41 })
      done()
    })

    test('Happy path', async (done) => {
      const matchOne = await Person.findByIdOrFail(harry._id as string)
      const matchTwo = await Person.findByIdOrFail(hermione.getId())
      expect(matchOne.name).toBe('Harry')
      expect(matchTwo.name).toBe('Hermione')
      done()
    })

    testExpectError('Throws error when no match', async () => {
      await Person.findByIdOrFail('this is a really implausible id')
    }, {
      message: `Could not find a Person with that id. No Person with that id exists in the connected Firebase Realtime Database`,
      constructor: ActiveClassError
    })
  })

  describe('#findOne', () => {
    beforeAll(async (done) => {
      await Person.delete({})
      await Person.create({ name: 'Harry', age: 40 })
      await Person.create({ name: 'Hermione', age: 41 })
      await Person.create({ name: 'Ron', age: 40 })
      done()
    })

    it('retrieves first match', async (done) => {
      const aged40 = await Person.findOne({ age: 40 })
      expect(aged40 && aged40.name).toBe('Harry')
      done()
    })

    it('returns null when no match', async (done) => {
      const aged50 = await Person.findOne({ age: 50 })
      expect(aged50).toBeNull()
      done()
    })
  })

  describe('#update', () => {
    beforeAll(async (done) => {
      await Person.delete({})
      done()
    })

    test('Happy path', async (done) => {
      await Person.create({ name: 'Harry', age: 40 })
      await Person.create({ name: 'Hermione', age: 41 })
      await Person.create({ name: 'Ron', age: 40 })

      const updatedPersons = await Person.update({ age: 40 }, { age: 50 })
      expect(updatedPersons[0].name).toBe('Harry')
      expect(updatedPersons[0].age).toBe(50)
      expect(updatedPersons[1].name).toBe('Ron')
      expect(updatedPersons[1].age).toBe(50)
      done()
    })
  })

  describe('#updateOne', () => {
    beforeAll(async (done) => {
      await Person.delete({})
      done()
    })

    test('Happy path', async (done) => {
      await Person.create({ name: 'Harry', age: 40 })
      await Person.create({ name: 'Ron', age: 40 })

      const updatedHarry = await Person.update({ age: 40 }, { age: 50 })
      expect(updatedHarry[0].name).toBe('Harry')
      expect(updatedHarry[0].age).toBe(50)
      done()
    })
  })

  
})

