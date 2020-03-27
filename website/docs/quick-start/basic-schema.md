---
id: basic-schema
title: Your first schema
sidebar_label: Your first schema
---


## Installation
```bash
npm install fireactive
```

## Example
### Creating a class
```js
import { ActiveClass, Schema } from 'fireactive'

const userSchema = {
  name: Schema.string,  // users must have a name
  age: Schema.number({ optional: true }), // age is optional
  role: Schema.enum(['admin', 'basic']), // role must be 'admin' or 'basic'
  isVerified: Schema.boolean({ default: false }) // defaults to 'false'
}

class User extends ActiveClass('User', userSchema) {
  /*
    User will inherit ActiveClass methods,
      prototype and static.
    
    Optionally, add further methods yourself,
      e.g.:
  */

  upgrade() {
    this.role = 'admin'
  }
}
```

### Instantiating
```js
import { initialize } from Fireactive

initialize({
  databaseURL: // your Firebase Realtime Database URL
})

// using top-level await for readability
const moll = await User.create({ name: 'Moll', role: 'basic' })
moll.name // => 'Moll'
moll.age // => undefined
moll.role // => 'basic'
moll.isVerified // => false: uses default schema value

moll.upgrade()
moll.role // => 'admin'
```

### Type safety
```js
const anon = await User.create({ role: 'admin' })
// => Error: could not create User. The required property 'name' was not supplied.

const meg = await User.create({ name: 'Meg', role: 'superuser' })
// => Error: could not create User. The supplied property 'role' is not of the required type.
```
