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

const queueSchema = {
  // ordered dictionary of playerIds
  playerIdsOrdered: Schema.indexed.string
}

class Player extends ActiveClass(playerSchema) {
  votingFor = relations.findById<Player, Player>(
    'Player',
    () => this.votingForId as string
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

class Queue extends ActiveClass(queueSchema) {
  players = relations.findByIds<Queue, Player>(
    'Player',
    () => Object.values(this.playerIdsOrdered)
  )
}
relations.store(Queue)

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

test('one-to-many relationship with queue ordering', async (done) => {
  const john = await Player.create({ name: 'John' })
  const marie = await Player.create({ name: 'Marie' })

  const queue = await Queue.create({
    playerIdsOrdered: {
      '100': richard.getId(),
      '105': rachel.getId(),
      '104': marie.getId(),
      '109': john.getId()
    }
  })
  const players = await queue.players()
  expect(players).toEqSerialize([richard, marie, rachel, john])
  done()
})