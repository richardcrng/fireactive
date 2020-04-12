import { ActiveClass, Schema, initialize, relations } from '../../../../src'
import { testDatabase } from '../../../../src/utils/setupTestServer'

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
