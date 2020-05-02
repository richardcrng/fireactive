---
id: methods
title: ActiveClass Methods
sidebar_label: Methods
---

import Link from '@docusaurus/Link';
import JsTsTabs, { JsTab, TsTab } from '../../../src/lib/atoms/JsTsTabs'
import TabItem from '@theme/TabItem';

All <Link to='/docs/api/active-document'>ActiveDocuments</Link> - that is, all instances of ES6 classes that extend `ActiveClass` - come with some default methods, used for interacting with your Firebase Realtime Database.

```js
import { ActiveClass, Schema } from 'fireactive'

const schema = {
  name: Schema.string,
  age: Schema.number
}

// Person is an ActiveClass
class Person extends ActiveClass(schema) {}

// ariana is an ActiveDocument
const ariana = new Person({ name: 'Ariana', age: 24 })

typeof ariana.name // => 'string'
typeof ariana.age // => 'number'
typeof ariana.save // => 'function'
typeof ariana.toObject // => 'function'
```

:::info Have you initialized?
To interact with your Firebase Realtime Database, you must first `initialize` a connection to your Firebase Realtime Database.

```js
import { initialize } from 'fireactive'
import { Person } from './models/Person'

const ariana = new Person({ name: 'Ariana', age: 24 })

await ariana.save()
/*
 * ActiveClassError: Failed to save Person into database.
 * Could not connect to your Firebase database.
 * This might be because you have not initialized your Firebase app.
 * Try calling Fireactive.initialize
 */

initialize({
  databaseURL: 'https://your-database.firebase.io'
})

await ariana.save() // runs
```
:::

## `getId`
Returns the ActiveDocument's `_id` property, or generates one if it does not already have one.

**Parameters:**
None

**Returns:** `string`, or throws an error if it tries to generate an `_id`  but the Firebase Realtime Database is not `initialize`d

#### Example
<JsTsTabs>
<TabItem value='js'>

```js
const ariana = new Person({ name: 'Ariana', age: 24 })
ariana._id // => undefined
ariana.getId() // => '-M6L2H0...'
ariana._id // => '-M6L2H0...'

const taylor = await Person.create({ name: 'Taylor', age: 29 })
taylor._id // => '-M7K4IP...'
taylor.getId() // => '-M7K4IP...'
```

</TabItem>
<TabItem value='ts'>

```ts
const ariana = new Person({ name: 'Ariana', age: 24 })
ariana._id // => undefined
ariana.getId() // => '-M6L2H0...'
ariana._id // => '-M6L2H0...'

const taylor = await Person.create({ name: 'Taylor', age: 29 })
taylor._id // => '-M7K4IP...'
taylor.getId() // => '-M7K4IP...'
```

</TabItem>
</JsTsTabs>

## `reload`
Refreshes the ActiveDocument's properties based on the current database values.

**Parameters:**
None

**Returns:** `object` reloaded from the database

#### Example
<JsTsTabs>
<TabItem value='js'>

```js
// create document in db
const ariana = await Person.create({ name: 'Ariana', age: 24 })

// turn off automatic syncing from db
ariana.syncOpts({ fromDb: false })

// write to db using Firebase api
await ariana.ref().update({ age: 25 })

ariana.age // => 24
await ariana.reload() // => { name: 'Ariana', age: 25 }
ariana.age // => 25
```

</TabItem>
<TabItem value='ts'>

```ts
// create document in db
const ariana = await Person.create({ name: 'Ariana', age: 24 })

// turn off automatic syncing from db
ariana.syncOpts({ fromDb: false })

// write to db using Firebase api
await ariana.ref().update({ age: 25 })

ariana.age // => 24
await ariana.reload()
// => { _id: '-M6L56...' name: 'Ariana', age: 25 }
ariana.age // => 25
```

</TabItem>
</JsTsTabs>

## `ref`

## `save`

## `pendingSetters`

## `syncOpts`