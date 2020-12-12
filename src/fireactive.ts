import dotenv from 'dotenv'
import ActiveClass from './ActiveClass'
import initialize from './initialize';
import Schema from './Schema';
import relations from './ActiveClass/relations';
import { setupTestServer, testDatabase } from './utils/setupTestServer';

dotenv.config()

const Fireactive = {
  initialize,
  ActiveClass,
  Schema,
  relations,
  setupTestServer,
  testDatabase
}

export {
  initialize,
  ActiveClass,
  Schema,
  relations,
  setupTestServer,
  testDatabase
}

export default Fireactive