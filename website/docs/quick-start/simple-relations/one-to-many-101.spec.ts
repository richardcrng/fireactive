import { ActiveClass, Schema, initialize, relations } from '../../../../src/'
import { testDatabase } from '../../../../src/utils/setupTestServer'

const authorSchema = {
  firstName: Schema.string,
  lastName: Schema.string
}

const bookSchema = {
  title: Schema.string,
  authorId: Schema.string
}

const seriesSchema = {
  name: Schema.string,
  bookIds: Schema.indexed.true
}

class Author extends ActiveClass(authorSchema) {
  get name(): string {
    return `${this.firstName} ${this.lastName}`
  }
}

class Book extends ActiveClass(bookSchema) {
  author = relations.findById<Book, Author>(Author, 'authorId')
}

class Series extends ActiveClass(seriesSchema) {
  books = relations.findByIds<Series, Book>(Book, () => Object.keys(this.bookIds))
}

const { databaseURL } = testDatabase()

const app = initialize({ databaseURL })

afterAll(async (done) => {
  await app.delete()
  done()
})

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