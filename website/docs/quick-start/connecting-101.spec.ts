import firebase from 'firebase/app'
import { initialize } from '../../../src/'
import { User } from './active-class-101.spec'
import { testDatabase } from '../../../src/utils/setupTestServer'


const { databaseURL } = testDatabase()

describe('Basic operations with Firebase', () => {
  test('connecting with `initialize`', () => {
    const app = initialize({ databaseURL })
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
})