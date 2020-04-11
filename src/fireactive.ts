import dotenv from 'dotenv'
import ActiveClass from './ActiveClass'
import initialize from './initialize';
import Schema from './Schema';
import relations from './ActiveClass/relations';

dotenv.config()

const Fireactive = {
  initialize,
  ActiveClass,
  Schema,
  relations
}

export {
  initialize,
  ActiveClass,
  Schema,
  relations
}

export default Fireactive