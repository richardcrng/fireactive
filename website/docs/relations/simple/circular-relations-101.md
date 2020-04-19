---
id: circular-relations
title: Circular Relations
sidebar_label: Circular Relations
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export const JsTsTabs = ({ children }) => (
  <Tabs
    defaultValue="js"
    values={[
      { label: 'JavaScript', value: 'js', },
      { label: 'TypeScript', value: 'ts', }
    ]}
  >
    {children}
  </Tabs>
)

## Problem: circular imports

When two of your ActiveClasses are meant to reciprocally relate to each other, you may encounter a problem of circular imports.

For example, consider the below two classes defined in separate folders. For the purposes of simplicity, we are assuming:
- People own at most one pet; and
- Pets have at most one owner (who is a person).

<Tabs
  defaultValue="person"
  values={[
    { label: 'src/models/person.js', value: 'person', },
    { label: 'src/models/animal.js', value: 'animal', }
  ]}
>
  <TabItem value="person">

  ```js
  import { ActiveClass, Schema, relations } from 'fireactive'
  import Animal from './animal'

  const personSchema = {
    name: Schema.string,
    age: Schema.number,
    petId: Schema.string({ optional: true }) // not all people have pets
  }

  class Person extends ActiveClass(personSchema) {
    pet = relations.findById(Animal, 'petId')
  }

  export default Person
  ```

  </TabItem>
  <TabItem value="animal">

  ```js
  import { ActiveClass, Schema, relations } from 'fireactive'
  import Person from './person'

  const animalSchema = {
    name: Schema.string,
    age: Schema.number,
    ownerId: Schema.string
  }

  class Animal extends ActiveClass(animalSchema) {
    owner = relations.findById(Person, 'ownerId')
  }

  export default Animal
  ```

  </TabItem>
</Tabs>

Because `person.js` imports from `animal.js`, which imports from `person.js`... we can get stuck in some messy [circular imports](https://stackoverflow.com/questions/38841469/how-to-fix-this-es6-module-circular-dependency).

## One fix: `relations.store`
You can reorganise your code to get around this, but there is an alternative solution provided by Fireactive.

To make a class available as a relation (without needing to be imported), pass it as an argument to `relations.store`, and then you can set up a relation using the string name of that class:

<Tabs
  defaultValue="person"
  values={[
    { label: 'src/models/person.js', value: 'person', },
    { label: 'src/models/animal.js', value: 'animal', },
    { label: 'Demo', value: 'demo' }
  ]}
>
  <TabItem value="person">

  ```js {11,15}
  import { ActiveClass, Schema, relations } from 'fireactive'

  const personSchema = {
    name: Schema.string,
    age: Schema.number,
    petId: Schema.string({ optional: true })
  }

  class Person extends ActiveClass(personSchema) {
    // pass the string 'Animal' instead of the class
    pet = relations.findById('Animal', 'petId')
  }

  // store the Person class so other classes can relate to it
  relations.store(Person)

  export default Person
  ```

  </TabItem>
  <TabItem value="animal">

  ```js {11,15}
  import { ActiveClass, Schema, relations } from 'fireactive'

  const animalSchema = {
    name: Schema.string,
    age: Schema.number,
    ownerId: Schema.string
  }

  class Animal extends ActiveClass(animalSchema) {
    // pass the string 'Person' instead of the class
    owner = relations.findById('Person', 'ownerId')
  }

  // store the Animal class so other classes can relate to it
  relations.store(Animal)

  export default Animal
  ```

  </TabItem>
  <TabItem value="demo">

  ```js
  import { initialize } from 'fireactive'
  import Animal from '../models/animal'
  import Person from '../models/person'
  
  // initialize with your own database url
  initialize({ databaseURL: process.env.DATABASE_URL })

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

  samsPet.name // => 'Old Yeller'
  yellersOwner.name // => 'Sam Coates'
  ```

  </TabItem>
</Tabs>

