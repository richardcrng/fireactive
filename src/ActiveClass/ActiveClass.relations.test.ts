import ActiveClass from '.';
import Schema from '../Schema';
import setupTestServer from '../utils/setupTestServer';
import '../utils/toEqSerialize'
import relations from './relations';

setupTestServer()

const playerSchema = {
  name: Schema.string,
  votingForId: Schema.string({ optional: true }), // player id
  gameId: Schema.string({ optional: true }) // game id
}

const gameSchema = {
  hostId: Schema.string,
  playerIds: Schema.indexed.boolean // dict of player ids
}

class Player extends ActiveClass(playerSchema) {
  votingFor = relations.findById<Player, Player>(
    'Player',
    () => this.votingForId
  )

  game = relations.findById<Player, Game>('Game', 'gameId')
}
relations.store(Player)

class Game extends ActiveClass(gameSchema) {
  players = relations.findByIds<Game, Player>(
    'Player',
    () => Object.keys(this.playerIds)
  )

  host = relations.findById<Game>(Player, 'hostId')
}
relations.store(Game)

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
  const game = await Game.create({
    hostId: rachel.getId(),
    playerIds: {
      [richard.getId()]: true,
      [rachel.getId()]: true
    }
  })
  richard.gameId = game.getId()
  await richard.pendingSetters()
  const players = await game.players()
  expect(players).toEqSerialize([richard, rachel])
  const richardsGame = await richard.game()
  expect(richardsGame).toEqSerialize(game)
  const host = await game.host()
  expect(host).toEqSerialize(rachel)
  done()
})