import firebase from 'firebase/app'
import { ActiveClass, Schema, initialize, relations } from '../../../src/'
import { testDatabase } from '../../../src/utils/setupTestServer'

const authorSchema = {
  firstName: Schema.string,
  lastName: Schema.string
}

const bookSchema = {
  title: Schema.string,
  authorId: Schema.string
}

class Author extends ActiveClass(authorSchema) {
  get name(): string {
    return `${this.firstName} ${this.lastName}`
  }
}

class Book extends ActiveClass(bookSchema) {
  author = relations.findById<Book, Author>(Author, 'authorId')
}

const { databaseURL } = testDatabase()

const app = initialize({ databaseURL })

afterAll(async (done) => {
  await app.delete()
  done()
})

describe('One-to-one', () => {
  test('Relation is lazy and a promise', async (done) => {
    const orwell = await Author.create({
      firstName: 'George',
      lastName: 'Orwell'
    })

    const animalFarm = await Book.create({
      title: 'Animal Farm: A Fairy Story',
      authorId: orwell.getId()
    })

    const animalFarmAuthor = await animalFarm.author()
    expect.assertions(3)
    if (animalFarmAuthor) {
      expect(animalFarmAuthor.firstName).toBe('George')
      expect(animalFarmAuthor.lastName).toBe('Orwell')
      expect(animalFarmAuthor.name).toBe('George Orwell')
    }
    done()
  })
})

const seriesSchema = {
  name: Schema.string,
  bookIds: Schema.indexed.true
}

class Series extends ActiveClass(seriesSchema) {
  books = relations.findByIds<Series, Book>(Book, () => Object.keys(this.bookIds))
}

describe('One-to-many', () => {
  test('Relation is lazy and a promise that returns an array', async (done) => {
    const adamFowler = await Author.create({
      firstName: 'Adam',
      lastName: 'Fowler'
    })

    const emilyVanderVeer = await Author.create({
      firstName: 'Emily',
      lastName: 'Vander Veer'
    })

    const noSqlForDummies = await Book.create({
      title: 'NoSQL For Dummies',
      authorId: adamFowler.getId()
    })

    const jsForDummies = await Book.create({
      title: 'JavaScript For Dummies',
      authorId: emilyVanderVeer.getId()
    })

    const dummiesSeries = await Series.create({
      name: 'For Dummies',
      bookIds: {
        [noSqlForDummies.getId()]: true,
        [jsForDummies.getId()]: true
      }
    })

    const dummiesBooks = await dummiesSeries.books()
    expect(dummiesBooks[0].title).toBe('NoSQL For Dummies')
    expect(dummiesBooks[1].title).toBe('JavaScript For Dummies')
    done()
  })
})