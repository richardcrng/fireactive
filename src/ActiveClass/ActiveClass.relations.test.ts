import ActiveClass from '.';
import Schema from '../Schema';
import pushWithId from '../utils/pushWithId';
import setupTestServer from '../utils/setupTestServer';
import '../utils/toEqSerialize'
import ActiveClassError from './Error';

const { server, db } = setupTestServer()

const playerSchema = {
  name: Schema.string,
  votingForId: Schema.string({ optional: true }), // player id
  gameId: Schema.string({ optional: true }) // game id
}

const gameSchema = {
  players: Schema.indexed.string // dict of player ids
}

class Player extends ActiveClass(playerSchema) {
  async votingFor(): Promise<Player | null> {
    try {
      const target = await Player.findById(this.votingForId as string)
      return target ? target : null
    } catch (err) {
      return null
    }
  }
}

class Game extends ActiveClass(gameSchema) {

}



describe('ActiveClass: one-to-one relation', () => {
  it('handles one-to-one relationships', async (done) => {
    const richard = await Player.create({ name: 'Richard' })
    const rachel = await Player.create({ name: 'Rachel', votingForId: richard.getId() })
    const target = await rachel.votingFor()
    expect(target).toEqSerialize(richard)
    done()
  })
})