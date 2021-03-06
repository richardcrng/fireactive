---
id: installation
title: Installation
sidebar_label: Installation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Setup

Fireactive can be installed on both:
- *client-side* applications, to give easy access to a realtime data layer; and
- *server-side* applications, to give type safety to your Firebase Realtime Database.

<Tabs
  defaultValue="npm"
  values={[
    { label: 'npm', value: 'npm', },
    { label: 'Yarn', value: 'yarn', }
  ]
}>
<TabItem value="npm">

```bash
npm install fireactive
```

</TabItem>
<TabItem value="yarn">

```bash
yarn add fireactive
```

</TabItem>
</Tabs>

## Usage
### Creating an `ActiveClass`
```js
import { ActiveClass, Schema } from 'fireactive'

// A schema for the User class
const userSchema = {
  name: Schema.string,  // users must have a name
  age: Schema.number({ optional: true }), // age is optional
  role: Schema.enum(['admin', 'basic']), // role must be 'admin' or 'basic'
  isVerified: Schema.boolean({ default: false }) // defaults to 'false'
}

export class User extends ActiveClass(userSchema) {
  /*
    User will inherit ActiveClass methods,
      prototype and static.
  */
    
  //  Optionally, add further methods yourself, e.g.
  promote() {
    this.role = 'admin'
  }
}
```

### Instantiating an `ActiveClass`
```js
import { initialize } from 'fireactive'
import { User } from '../models/User' // or wherever

// Initialize Fireactive to bring your ActiveClass to life
initialize({
  // provide your Firebase Realtime Database URL, e.g.
  databaseURL: 'https://some-database-url.firebaseio.com'
})

// using top-level await for readability
const user = await User.create({ name: 'Moll', role: 'basic' })
user.name // => 'Moll'
user.age // => undefined
user.role // => 'basic'
user.isVerified // => false: uses default schema value

user.promote()
user.role // => 'admin'
```

### Type safety
```js
await User.create({ role: 'admin' })
// => ActiveClassError: Could not create User.
//      The required property 'name' is missing

await User.create({ name: 'Meg', role: 'superuser' })
// => ActiveClassError: Could not create User.
//      The property 'role' is of the wrong type

user.role = 'superuser'
// => ActiveClassError: User could not accept the value
//      "superuser" (string) at path 'role'. The
//      propety 'role' is of the wrong type
```
