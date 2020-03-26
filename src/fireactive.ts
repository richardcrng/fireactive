import dotenv from 'dotenv'
import baseClass from './baseClass'
import initialize from './initialize';
import Schema from './Schema';
import setupTestServer from './utils/setupTestServer';

dotenv.config()

const Fireactive = {
  initialize,
  baseClass,
  Schema,
  setupTestServer
}

export {
  initialize,
  baseClass,
  Schema,
  setupTestServer
}

export default Fireactive