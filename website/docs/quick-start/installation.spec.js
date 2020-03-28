const { ActiveClass, Schema, initialize } = require('../../../src/');
const { testDatabase } = require('../../../src/utils/setupTestServer');
const ActiveClassError = require('../../../src/ActiveClass/Error/ActiveClassError').default

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
    upgrade() {
      this.role = 'admin'
    }
  }

  it('trivial', () => {
    expect(4).toBe(4)
  })

  const { databaseURL } = testDatabase()

  const app = initialize({ databaseURL })

  afterAll(async (done) => {
    await app.delete()
    done()
  })

  test('Instantiating an `ActiveClass`', async (done) => {
    const moll = await User.create({ name: 'Moll', role: 'basic' })
    expect(moll.name).toBe('Moll') // => 'Moll'
    expect(moll.age).toBeUndefined()
    expect(moll.role).toBe('basic')
    expect(moll.isVerified).toBe(false)

    // @ts-ignore
    moll.upgrade()
    expect(moll.role).toBe('admin')
    done()
  })

  test('Type safety', async (done) => {
    expect.assertions(4)
    try {
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

    done()
  })
})