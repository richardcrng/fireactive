import dotenv from 'dotenv'
import ActiveClass from './ActiveClass'
import initialize from './initialize';
import Schema from './Schema';

dotenv.config()

const Fireactive = {
  initialize,
  ActiveClass,
  Schema
}

export {
  initialize,
  ActiveClass,
  Schema
}

export default Fireactive