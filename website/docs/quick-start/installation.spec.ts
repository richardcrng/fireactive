import { ActiveClass, Schema, initialize } from '../../../src/'
import { testDatabase } from '../../../src/utils/setupTestServer'
import ActiveClassError from '../../../src/ActiveClass/Error/ActiveClassError'

describe('Usage', () => {
  // A schema for the User class
  const userSchema = {
    name: Schema.string,  // users must have a name
    age: Schema.number({ optional: true }), // age is optional
    role: Schema.enum(['admin', 'basic']), // role must be 'admin' or 'basic'
    isVerified: Schema.boolean({ default: false }) // defaults to 'false'
  }

  class User extends ActiveClass(userSchema) {
    /*
      User will inherit ActiveClass methods,
        prototype and static.
    */

    //  Optionally, add further methods yourself, e.g.
    promote() {
      this.role = 'admin'
    }
  }

  const { databaseURL } = testDatabase()

  const app = initialize({ databaseURL })

  afterAll(async (done) => {
    await app.delete()
    done()
  })

  let user: User

  test('Instantiating an `ActiveClass`', async (done) => {
    user = await User.create({ name: 'Moll', role: 'basic' })
    expect(user.name).toBe('Moll') // => 'Moll'
    expect(user.age).toBeUndefined()
    expect(user.role).toBe('basic')
    expect(user.isVerified).toBe(false)
    user.promote()
    expect(user.role).toBe('admin')
    done()
  })

  test('Type safety', async (done) => {
    expect.assertions(6)
    try {
      // @ts-ignore: check static error -> runtime error
      await User.create({ role: 'admin' })
    } catch (err) {
      expect(err).toBeInstanceOf(ActiveClassError)
      expect(err.message).toMatch("Could not create User. The required property 'name' is missing")
    }

    try {
      // @ts-ignore: check static -> runtime error
      await User.create({ name: 'Meg', role: 'superuser' })
    } catch (err) {
      expect(err).toBeInstanceOf(ActiveClassError)
      expect(err.message).toMatch("Could not create User. The property 'role' is of the wrong type")
    }

    try {
      // @ts-ignore: check static -> runtime error
      user.role = 'superuser'
    } catch (err) {
      expect(err).toBeInstanceOf(ActiveClassError)
      expect(err.message).toMatch(`User could not accept the value "superuser" (string) at path 'role'. The property 'role' is of the wrong type`)
    }

    done()
  })
})