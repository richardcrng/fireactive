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
Create a new model and save it to the database.

**Parameters:**
- `props`: an object of properties that conforms to the ActiveClass's <Link to='/docs/api/schema'>Schema</Link>

**Returns:** `Promise<ActiveDocument>`

#### Example
<JsTsTabs>
<TabItem value='js'>

```js
const helen = await Person.create({ name: 'Helen', age: 27 })
helen.name // => 'Helen'
helen.age // => 27

await Person.create({ name: 'Helen' })
// (ts 2332) Property 'age' is missing in type '{ name: string; }' but required in type

await Person.create({ name: 'Helen', age: '27' })
// (ts 2332) Type 'string' is not assignable to type 'number'
```

</TabItem>
<TabItem value='ts'>

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
</JsTsTabs>

### `delete`

### `deleteOne`

### `find`

### `findById`

### `findByIdOrFail`

### `findOne`

### `update`

### `updateOne`

## Other methods

### `cache`

### `from`

### `getDb`

### `ref`

### `value`

### `values`

