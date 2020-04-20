import { Schema, ActiveClass } from "../../../src"
import testExpectError from "../../../src/utils/testExpectError"
import ActiveClassError from "../../../src/ActiveClass/Error"


describe('Basic usage', () => {
  let userSchema = {
    name: Schema.string,
    age: Schema.number,
    role: Schema.enum(['admin', 'basic']),
    isVerified: Schema.boolean
  }

  class User extends ActiveClass(userSchema) {}

  describe('Runtime errors', () => {
    testExpectError("doesn't allow creation if missing properties", () => {
      // @ts-ignore
      new User({ name: 'Joe Bloggs', age: 42 })
    },
    { message: `Could not construct User. The required property 'role' is missing`, constructor: ActiveClassError })

    testExpectError("doesn't allow creation if properties are of the wrong type", () => {
      // @ts-ignore
      new User({ name: 'Joe Bloggs', age: 42, role: 'elite hacker', isVerified: 'true' })
    },
      { message: `Could not construct User. The property 'role' is of the wrong type`, constructor: ActiveClassError })
  })
})
