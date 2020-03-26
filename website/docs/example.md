---
id: getting-started
title: Getting started
sidebar_label: 
---


## Installation
```bash
npm install fireactive
```

## Example
### Creating a class
```js
import * as Fireactive from 'fireactive'
// const Fireactive = require('fireactive')

const userSchema = {
  name: Schema.string,  // users must have a name
  age: Schema.number({ optional: true }), // age is optional
  role: Schema.enum(['admin', 'basic']), // role must be 'admin' or 'basic'
  isVerified: Schema.boolean({ default: false }) // defaults to 'false'
}

class User extends ActiveClass('User', userSchema) {
  // optionally add some prototype and static methods
}
```

