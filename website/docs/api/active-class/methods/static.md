---
id: static
title: ActiveClass Methods
sidebar_label: Methods
---

import Link from '@docusaurus/Link';
import JsTsTabs, { JsTab, TsTab } from '../../../../src/lib/atoms/JsTsTabs'
import TabItem from '@theme/TabItem';

All <Link to='/docs/api/active-class'>ActiveClasses</Link> - that is, all ES6 classes that extend `ActiveClass` - come with some default methods, used for interacting with your Firebase Realtime Database.

```js
import { ActiveClass, Schema, initialize } from 'fireactive'

const schema = {
  name: Schema.string,
  age: Schema.number
}

class Person extends ActiveClass(schema) {}

typeof Person.create // => 'function'
typeof Person.find // => 'function'
typeof Person.update // => 'function'
typeof Person.delete // => 'function'
```

:::info Have you initialized?
To interact with your Firebase Realtime Database, you must first `initialize` a connection to your Firebase Realtime Database.

```js
import { initialize } from 'fireactive'
import { Person } from './models/Person'

await Person.create({ name: 'Helen', age: 27 })
/*
 * ActiveClassError: Failed to create Person.
 * Could not connect to your Firebase database.
 * This might be because you have not initialized your Firebase app.
 * Try calling Fireactive.initialize
 */

initialize({
  databaseURL: 'https://your-database.firebase.io'
})

await Person.create({ name: 'Helen', age: 27 }) // runs
```
:::

## Basic CRUD methods

### `create`
Creates a new model from an object and saves it to the database.

**Parameters:**
- `props`: an object of properties that conforms to the ActiveClass's <Link to='/docs/api/schema'>Schema</Link>

**Returns:** `Promise<ActiveDocument>`, a promise that resolves into the <Link to='/docs/api/active-document'>ActiveDocument</Link> that has been created

#### Example
<JsTsTabs>
<TabItem value='js'>

```js
const helen = await Person.create({ name: 'Helen', age: 27 })
helen.name // => 'Helen'
helen.age // => 27

await Person.create({ name: 'Helen' })
// ActiveClassError: Could not create Person. The required property 'age' is missing

await Person.create({ name: 'Helen', age: '27' })
// ActiveClassError: Could not create Person. The property 'age' is of the wrong type
```

</TabItem>
<TabItem value='ts'>

```js
const helen = await Person.create({ name: 'Helen', age: 27 })
helen.name // => 'Helen'
helen.age // => 27

await Person.create({ name: 'Helen' })
// (ts 2332) Property 'age' is missing in type '{ name: string; }' but required in type...

await Person.create({ name: 'Helen', age: '27' })
// (ts 2332) Type 'string' is not assignable to type 'number'
```

</TabItem>
</JsTsTabs>

### `delete`
Deletes all matching documents that partially match the passed in object.

**Parameters:**
- `props`: an object of properties that is consistent with the ActiveClass's <Link to='/docs/api/schema'>Schema</Link> (but needn't include all properties)

**Returns:** `Promise<number>`, a promise that resolves with the count of matched documents deleted

#### Example
<JsTsTabs>
<TabItem value='js'>

```js
await Person.delete({})
// this will delete all entries in the database,
//  since all properties of an empty object match
//  any other entry

// let's create three Persons
await Person.create({ name: 'Harry', age: 40 })
await Person.create({ name: 'Hermione', age: 41 })
await Person.create({ name: 'Ron', age: 40 })

// delete all Persons with age of 40
await Person.delete({ age: 40 }) // => 2

// delete all Persons with a name of 'Harry'
//  this should resolve to 0, since Harry has
//  already been deleted by the above #delete
await Person.delete({ name: 'Harry' }) // => 0

// let's finish up by deleting our one remaining
//  Person, Hermione (aged 41), with a delete all
await Person.delete({}) // => 1
```

</TabItem>
<TabItem value='ts'>

```ts
await Person.delete({})
// this will delete all entries in the database,
//  since all properties of an empty object match
//  any other entry

// let's create three Persons
await Person.create({ name: 'Harry', age: 40 })
await Person.create({ name: 'Hermione', age: 41 })
await Person.create({ name: 'Ron', age: 40 })

// delete all Persons with age of 40
await Person.delete({ age: 40 }) // => 2

// delete all Persons with a name of 'Harry'
//  this should resolve to 0, since Harry has
//  already been deleted by the above #delete
await Person.delete({ name: 'Harry' }) // => 0

// let's finish up by deleting our one remaining
//  Person, Hermione (aged 41), with a delete all
await Person.delete({}) // => 1
```

</TabItem>
</JsTsTabs>

### `deleteOne`
Deletes the first document that partially matches the passed in object.

**Parameters:**
- `props`: an object of properties that is consistent with the ActiveClass's <Link to='/docs/api/schema'>Schema</Link> (but needn't include all properties)

**Returns:** `Promise<boolean>`, a promise that resolves with whether or not a document was deleted

#### Example
<JsTsTabs>
<TabItem value='js'>

```js
// assuming we're starting with a fresh database

await Person.create({ name: 'Harry', age: 40 })
await Person.create({ name: 'Hermione', age: 41 })

await Person.delete({ name: 'Harry' }) // => true
await Person.delete({ name: 'Ron' }) // => false
await Person.delete({ age: 40 }) // => false (Harry is already deleted, so nothing to delete)
```

</TabItem>
<TabItem value='ts'>

```ts
// assuming we're starting with a fresh database

await Person.create({ name: 'Harry', age: 40 })
await Person.create({ name: 'Hermione', age: 41 })

await Person.delete({ name: 'Harry' }) // => true
await Person.delete({ name: 'Ron' }) // => false
await Person.delete({ age: 40 }) // => false (Harry is already deleted, so nothing to delete)
```

</TabItem>
</JsTsTabs>

### `find`
Instantiates an ActiveDocument for every document in the database that partially matches the passed in object.

**Parameters:**
- `props`: an object of properties that is consistent with the ActiveClass's <Link to='/docs/api/schema'>Schema</Link> (but needn't include all properties)

**Returns:** `Promise<ActiveDocument[]>`, a promise that resolves with an array of <Link to='/docs/api/active-document'>ActiveDocuments</Link>

#### Example
<JsTsTabs>
<TabItem value='js'>

```js
// assuming we're starting with a fresh database

await Person.create({ name: 'Harry', age: 40 })
await Person.create({ name: 'Hermione', age: 41 })
await Person.create({ name: 'Ron', age: 40 })

const aged40 = await Person.find({ age: 40 })
aged40[0].name // => 'Harry'
aged40[1].name // => 'Ron'
```

</TabItem>
<TabItem value='ts'>

```ts
// assuming we're starting with a fresh database

await Person.create({ name: 'Harry', age: 40 })
await Person.create({ name: 'Hermione', age: 41 })
await Person.create({ name: 'Ron', age: 40 })

const aged40 = await Person.find({ age: 40 })
aged40[0].name // => 'Harry'
aged40[1].name // => 'Ron'
```

</TabItem>
</JsTsTabs>

### `findById`
Instantiates an ActiveDocument for a document with the passed in id.

**Parameters:**
- `id`: string

**Returns:** `Promise<ActiveDocument | null>`, a promise that resolves with the matching <Link to='/api/docs/active-document'>ActiveDocument</Link> if it exists, and `null` otherwise

#### Example
<JsTsTabs>
<TabItem value='js'>

```js
// assuming we're starting with a fresh database

const harry = await Person.create({ name: 'Harry', age: 40 })
const hermione = await Person.create({ name: 'Hermione', age: 41 })

harry._id // => '-at293f...'
hermione.getId() // => '-au492p...'

const matchOne = await Person.findById(harry._id)
const matchTwo = await Person.findById(hermione.getId())

matchOne.name // => 'Harry'
matchTwo.name // => 'Hermione'

const matchThree = await Person.findById('this is a really implausible id')
matchThree // => null
```

</TabItem>
<TabItem value='ts'>

```ts
// assuming we're starting with a fresh database

const harry = await Person.create({ name: 'Harry', age: 40 })
const hermione = await Person.create({ name: 'Hermione', age: 41 })

harry._id // => '-at293f...'
hermione.getId() // => '-au492p...'

const matchOne = await Person.findById(harry._id as string) // _id is typed as string | null
const matchTwo = await Person.findById(hermione.getId()) // getId() returns a string or throws

matchOne?.name // => 'Harry'
matchTwo?.name // => 'Hermione'

const matchThree = await Person.findById('this is a really implausible id')
matchThree // => null
```

</TabItem>
</JsTsTabs>

### `findByIdOrFail`
Instantiates an ActiveDocument for a document with the passed in id, throwing an error if no document matches.

**Parameters:**
- `id`: string

**Returns:** `Promise<ActiveDocument>`, a promise that resolves with the matching <Link to='/api/docs/active-document'>ActiveDocument</Link>, or otherwise throws an error

#### Example
<JsTsTabs>
<TabItem value='js'>

```js
// assuming we're starting with a fresh database

const harry = await Person.create({ name: 'Harry', age: 40 })
const hermione = await Person.create({ name: 'Hermione', age: 41 })

harry._id // => '-at293f...'
hermione.getId() // => '-au492p...'

const matchOne = await Person.findByIdOrFail(harry._id)
const matchTwo = await Person.findByIdOrFail(hermione.getId())

matchOne.name // => 'Harry'
matchTwo.name // => 'Hermione'

await Person.findByIdOrFail('this is a really implausible id')
/*
 * Could not find a Person with that id.
 * No Person with that id exists in the
 * connected Firebase Realtime Database
 */
```

</TabItem>
<TabItem value='ts'>

```ts
// assuming we're starting with a fresh database

const harry = await Person.create({ name: 'Harry', age: 40 })
const hermione = await Person.create({ name: 'Hermione', age: 41 })

harry._id // => '-at293f...'
hermione.getId() // => '-au492p...'

const matchOne = await Person.findByIdOrFail(harry._id as string) // _id is typed as string | null
const matchTwo = await Person.findByIdOrFail(hermione.getId()) // getId() returns a string or throws

matchOne.name // => 'Harry'
matchTwo.name // => 'Hermione'

await Person.findByIdOrFail('this is a really implausible id')
/*
 * Could not find a Person with that id.
 * No Person with that id exists in the
 * connected Firebase Realtime Database
 */
```

</TabItem>
</JsTsTabs>

### `findOne`
Instantiates an ActiveDocument for the first document in the database that partially matches the passed in object.

**Parameters:**
- `props`: an object of properties that is consistent with the ActiveClass's <Link to='/docs/api/schema'>Schema</Link> (but needn't include all properties)

**Returns:** `Promise<ActiveDocument | null>`, a promise that resolves with the first matching <Link to='/api/docs/active-document'>ActiveDocument</Link> if any exists, and `null` otherwise

#### Example
<JsTsTabs>
<TabItem value='js'>

```js
// assuming we're starting with a fresh database

await Person.create({ name: 'Harry', age: 40 })
await Person.create({ name: 'Hermione', age: 41 })
await Person.create({ name: 'Ron', age: 40 })

const aged40 = await Person.findOne({ age: 40 })
aged40?.name // => 'Harry'

const aged50 = await Person.findOne({ age: 50 })
aged50 // => null
```

</TabItem>
<TabItem value='ts'>

```ts
// assuming we're starting with a fresh database

await Person.create({ name: 'Harry', age: 40 })
await Person.create({ name: 'Hermione', age: 41 })
await Person.create({ name: 'Ron', age: 40 })

const aged40 = await Person.findOne({ age: 40 })
aged40?.name // => 'Harry'

const aged50 = await Person.findOne({ age: 50 })
aged50 // => null
```

</TabItem>
</JsTsTabs>

### `update`

### `updateOne`

## Other methods

### `cache`

### `from`

### `getDb`

### `ref`

### `value`

### `values`

