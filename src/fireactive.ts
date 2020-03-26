import dotenv from 'dotenv'
import ActiveClass from './baseClass'
import initialize from './initialize';
import Schema from './Schema';
import setupTestServer from './utils/setupTestServer';

dotenv.config()

const Fireactive = {
  initialize,
  ActiveClass,
  Schema,
  setupTestServer
}

export {
  initialize,
  ActiveClass,
  Schema,
  setupTestServer
}

export default Fireactive