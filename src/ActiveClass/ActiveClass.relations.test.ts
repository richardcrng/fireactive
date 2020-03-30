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
  playerIds: Schema.indexed.boolean // dict of player ids
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
  async players(): Promise<Player[]> {
    const promises = Object.keys(this.playerIds).map(id => Player.findById(id))
    const res = await Promise.all(promises)
    return res.filter(val => val) as Player[]
  }
}

let richard: Player
let rachel: Player

test('one-to-one relationship', async (done) => {
  richard = await Player.create({ name: 'Richard' })
  rachel = await Player.create({ name: 'Rachel', votingForId: richard.getId() })
  const target = await rachel.votingFor()
  expect(target).toEqSerialize(richard)
  done()
})

test('one-to-many relationship', async (done) => {
  const game = await Game.create({ playerIds: {
    [richard.getId()]: true,
    [rachel.getId()]: true
  }})
  const players = await game.players()
  expect(players).toEqSerialize([richard, rachel])
  done()
})