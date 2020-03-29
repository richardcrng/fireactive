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

  it('Saving data with `.save`', async (done) => {
    const user = new User({ name: 'Richard', role: 'admin' })
    expect(user._id).toBeUndefined()
    await user.save()
    expect(user._id).toBeDefined()
    expect(typeof user._id).toBe('string')
    done()
  })
})