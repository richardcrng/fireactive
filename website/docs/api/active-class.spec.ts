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
    get name(): string {
      return `${this.firstName} ${this.lastName}`
    }

    about(): string {
      return `Hello, my name is ${this.firstName}, and I'm ${this.age} years old!`
    }

    celebrateBirthday(): void {
      this.age += 1
    }
  }

  test('Creation', async (done) => {
    const person = await Person.create({ firstName: 'Elizabeth', lastName: 'Windsor', age: 94 })
    expect(person.name).toBe("Elizabeth Windsor")
    expect(person.about()).toBe("Hello, my name is Elizabeth, and I'm 94 years old!")
    person.celebrateBirthday()
    expect(person.age).toBe(95)
    done()
  })
})

describe('Extending: static methods', () => {
  const personSchema = {
    firstName: Schema.string,
    lastName: Schema.string,
    age: Schema.number
  }

  class Person extends ActiveClass(personSchema) {
    static newBirth(surname: string): Promise<Person> {
      return this.create({
        firstName: 'Baby',
        lastName: surname,
        age: 0
      })
    }
  }

  test('Creation', async (done) => {
    const baby = await Person.newBirth('Simpson')
    expect(baby.firstName).toBe('Baby')
    expect(baby.lastName).toBe('Simpson')
    expect(baby.age).toBe(0)
    done()
  })
})

