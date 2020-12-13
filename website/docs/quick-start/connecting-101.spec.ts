import * as firebase from 'firebase/app'
import { ActiveClass, Schema, initialize } from '../../../src/'
import { testDatabase } from '../../../src/utils/setupTestServer'

const userSchema = {
  name: Schema.string,  // users must have a name
  age: Schema.number({ optional: true }), // age is optional
  role: Schema.enum(['admin', 'basic']), // role must be 'admin' or 'basic'
  isVerified: Schema.boolean({ default: false }) // defaults to false
}

class User extends ActiveClass(userSchema) {
  // optionally, add your own methods, e.g.

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

describe('Basic operations with Firebase', () => {
  test('connecting with `initialize`', () => {
    expect(app).toBe(firebase.app())
  })

  test('Saving data with `.save`', async (done) => {
    const richard = new User({ name: 'Richard', role: 'admin' })
    expect(richard._id).toBeUndefined()
    await richard.save()
    expect(richard._id).toBeDefined()
    expect(typeof richard._id).toBe('string')
    done()
  })

  test('Inserting data with `.create`', async (done) => {
    const chuck = await User.create({ name: 'Chuck Norris', role: 'admin' })
    expect(chuck._id).toBeDefined()
    expect(typeof chuck._id).toBe('string')
    done()
  })

  test('Fetching data with `.find`', async (done) => {
    const admins = await User.find({ role: 'admin' })
    expect(admins[0].name).toBe('Richard')
    expect(admins[1].name).toBe('Chuck Norris')
    done()
  })
})