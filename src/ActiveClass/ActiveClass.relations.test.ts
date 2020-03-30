import ActiveClass from '.';
import Schema from '../Schema';
import pushWithId from '../utils/pushWithId';
import setupTestServer from '../utils/setupTestServer';
import '../utils/toEqSerialize'
import ActiveClassError from './Error';

describe('ActiveClass: one-to-one relation', () => {
  const { server, db } = setupTestServer()

  const playerSchema = {
    name: Schema.string,
    votingFor: Schema.string({ optional: true }) // player id
  }

  class Player extends ActiveClass(playerSchema) {
    async voteTarget(): Promise<Player | null> {
      try {
        const target = await Player.findById(this.votingFor as string)
        return target ? target : null
      } catch (err) {
        return null
      }
    }
  }

  it('handles one-to-one relationships', async (done) => {
    const richard = await Player.create({ name: 'Richard' })
    const rachel = await Player.create({ name: 'Rachel', votingFor: richard.getId() })
    const target = await rachel.voteTarget()
    expect(target).toEqSerialize(richard)
    done()
  })
})