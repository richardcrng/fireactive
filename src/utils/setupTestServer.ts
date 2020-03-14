import FirebaseServer from 'firebase-server'
import initialize from '../initialize';

function setupTestServer() {
  const server = new FirebaseServer(0, 'localhost')
  const firebaseConfig = {
    databaseURL: `ws://localhost:${server.getPort()}`
  }
  const app = initialize(firebaseConfig)
  const db = app.database()

  afterAll(async (done) => {
    await server.close()
    await app.delete()
    done()
  })

  return { server, app, db }
}

export default setupTestServer