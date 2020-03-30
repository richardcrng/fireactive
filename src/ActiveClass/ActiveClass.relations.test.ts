import ActiveClass from '.';
import Schema from '../Schema';
import pushWithId from '../utils/pushWithId';
import setupTestServer from '../utils/setupTestServer';
import '../utils/toContainObject'
import ActiveClassError from './Error';

describe('ActiveClass: with server connection', () => {
  const { server, db } = setupTestServer()

  const playerSchema = {
    name: Schema.string,
    votingFor: Schema.string // player id
  }

  class Player extends ActiveClass(playerSchema) {}

})