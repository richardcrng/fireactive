import dotenv from 'dotenv'
import ActiveClass from './ActiveClass'
import initialize from './initialize';
import Schema from './Schema';
import setupTestServer, { testDatabase } from './utils/setupTestServer';
// https://github.com/microsoft/TypeScript/issues/5711#issuecomment-157793294
// for d.ts
import FirebaseServer from 'firebase-server'

dotenv.config()

const Fireactive = {
  initialize,
  ActiveClass,
  Schema,
  setupTestServer,
  testDatabase
}

export {
  initialize,
  ActiveClass,
  Schema,
  setupTestServer,
  testDatabase
}

export default Fireactive