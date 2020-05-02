---
id: static
title: ActiveClass Methods
sidebar_label: Methods
---

import Link from '@docusaurus/Link';
import JsTsTabs, { JsTab, TsTab } from '../../../../src/lib/atoms/JsTsTabs'
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
const helen = await Person.create({ name: 'Helen', age: 27 })
helen.name // => 'Helen'
helen.age // => 27

await Person.create({ name: 'Helen' })
// ActiveClassError: Could not create Person. The required property 'age' is missing

await Person.create({ name: 'Helen', age: '27' })
// ActiveClassError: Could not create Person. The property 'age' is of the wrong type
```

## `reload`

## `ref`

## `save`

## `pendingSetters`

## `syncOpts`