import { Schema, ActiveClass, initialize } from "../../../src"
import { testDatabase } from '../../../src/utils/setupTestServer'
import testExpectError from "../../../src/utils/testExpectError"
import ActiveClassError from "../../../src/ActiveClass/Error"

const { databaseURL } = testDatabase()

const app = initialize({ databaseURL })

afterAll(async (done) => {
  await app.delete()
  done()
})

describe('Basic ActiveClass', () => {
  const personSchema = {
    firstName: Schema.string,
    lastName: Schema.string,
    age: Schema.number
  }

  class Person extends ActiveClass(personSchema) {}

  test('Creation', async (done) => {
    const person = await Person.create({ firstName: 'Elizabeth', lastName: 'Windsor', age: 94 })
    expect(person.firstName).toBe('Elizabeth')
    expect(person.lastName).toBe('Windsor')
    expect(person.age).toBe(94)
    expect(typeof person._id).toBe('string')
    done()
  })
})

describe('Extending: prototype / instance methods', () => {
  const personSchema = {
    firstName: Schema.string,
    lastName: Schema.string,
    age: Schema.number
  }

  class Person extends ActiveClass(personSchema) {
    introduce(): string {
      return `Hello, my name is ${this.firstName}, and I'm ${this.age} years old!`
    }

    get name(): string {
      return `${this.firstName} ${this.lastName}`
    }
  }

  test('Creation', async (done) => {
    const person = await Person.create({ firstName: 'Elizabeth', lastName: 'Windsor', age: 94 })
    expect(person.introduce()).toBe("Hello, my name is Elizabeth, and I'm 94 years old!")
    expect(person.name).toBe("Elizabeth Windsor")
    done()
  })
})
