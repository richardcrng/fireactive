import dotenv from 'dotenv'
import baseClass from './baseClass'
import initialize from './initialize';
import Schema from './Schema';

dotenv.config()

const Fireactive = {
  initialize,
  baseClass,
  Schema
}

export {
  initialize,
  baseClass,
  Schema
}

export default Fireactive