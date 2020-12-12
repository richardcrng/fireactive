import FirebaseServer from 'firebase-server'
import initialize from '../initialize';

export const testDatabase = () => {
  const server = new FirebaseServer(0, 'localhost')
  const databaseURL = `ws://localhost:${server.getPort()}`
  afterAll(async (done) => {
    await server.close()
    done()
  })
  return { server, databaseURL }
}

export function setupTestServer() {
  const { server, databaseURL } = testDatabase()
  const firebaseConfig = { databaseURL }
  const app = initialize(firebaseConfig)
  const db = app.database()

  afterAll(async (done) => {
    await app.delete()
    done()
  })

  return { server, app, db }
}

export default setupTestServer