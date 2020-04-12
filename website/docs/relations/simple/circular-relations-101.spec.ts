import { ActiveClass, Schema, initialize, relations } from '../../../../src'
import { testDatabase } from '../../../../src/utils/setupTestServer'
import '../../../../src/utils/toEqSerialize'

// Person

const personSchema = {
  name: Schema.string,
  age: Schema.number,
  petId: Schema.string({ optional: true })
}

class Person extends ActiveClass(personSchema) {
  pet = relations.findById<Person>('Animal', 'petId')
}

relations.store(Person)


// Animal

const animalSchema = {
  name: Schema.string,
  age: Schema.number,
  ownerId: Schema.string
}

class Animal extends ActiveClass(animalSchema) {
  owner = relations.findById<Animal>('Person', 'ownerId')
}

relations.store(Animal)


const { databaseURL } = testDatabase()

const app = initialize({ databaseURL })

afterAll(async (done) => {
  await app.delete()
  done()
})


test('Relations work if stored', async (done) => {
  const sam = await Person.create({
    name: 'Sam Coates',
    age: 14
  })

  const oldYeller = await Animal.create({
    name: 'Old Yeller',
    age: 5,
    ownerId: sam.getId()
  })

  sam.petId = oldYeller.getId()

  const samsPet = await sam.pet()
  const yellersOwner = await oldYeller.owner()

  expect(samsPet).toEqSerialize(oldYeller)
  expect(yellersOwner).toEqSerialize(sam)
  done()
})