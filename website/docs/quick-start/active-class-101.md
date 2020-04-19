---
id: active-class-101
title: Creating an ActiveClass
sidebar_label: Creating an ActiveClass
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TabItem from '@theme/TabItem';
import JsTsTabs from '../../src/lib/atoms/JsTsTabs';

## Why use an ActiveClass?

A Fireactive ActiveClass comes with lots of convenient prototype and static methods to make it easy to create, update and sync data to and from your Firebase Realtime Database.

:::info ActiveClass? ActiveRecord?
This documentation distinguishes between:

1. An *ActiveClass*, which is an ES6 Class that extends `ActiveClass(someSchema)`; and
2. An *ActiveRecord*, which is *instance* of some ActiveClass.
:::

## ES6 Classes with `ActiveClass`

### Extending using your `Schema`

To create an `ActiveClass`, you should declare an [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) that extends `ActiveClass(someSchema)`.

In the below example, we'll be using the [user `Schema` defined previously](schema-101.md).

<JsTsTabs>
<TabItem value="js">

```js
import { ActiveClass } from 'fireactive'
import { userSchema } from '../wherever'

class User extends ActiveClass(userSchema) {
  // optionally, add your own methods, e.g.

  promote() {
    this.role = 'admin'
  }
}

```

</TabItem>
<TabItem value="ts">

```ts
import { ActiveClass } from 'fireactive'
import { userSchema } from '../wherever'

class User extends ActiveClass(userSchema) {
  // optionally, add your own methods, e.g.

  promote(): string {
    this.role = 'admin'
  }
}

```

</TabItem>
</JsTsTabs>

### Instantiating your ActiveClass

We can create an instance of our new `User` ActiveClass in the same way that we'd create an instance of a typical ES6 class, with the `new` operator:

<JsTsTabs>
<TabItem value="js">

```js
const user = new User({ name: 'Richard', role: 'admin' })
user.name // => 'Richard'
user.age // => undefined
user.role // => 'admin'
user.isVerified // => false (default value from schema)
```

</TabItem>
<TabItem value="ts">

```ts
const user = new User({ name: 'Richard', role: 'admin' })
user.name // => 'Richard'
user.age // => undefined
user.role // => 'admin'
user.isVerified // => false (default value from schema)
```

</TabItem>
</JsTsTabs>

However, notice that using the `new` keyword like this means that:
- the data has not yet been inserted into the database; and that
- by default, therefore, there is no syncing to or from the database for this `User`.

We can confirm this by checking the `_id` property and using the default ActiveClass prototype `.syncOpts` method:

<JsTsTabs>
<TabItem value="js">

```js
user._id // => undefined (but all users in the database will have one)
user.syncOpts() // => { fromDb: false, toDb: false }
```

</TabItem>
<TabItem value="ts">

```ts
user._id // => undefined (but all users in the database will have one)
user.syncOpts() // => { fromDb: false, toDb: false }
```

</TabItem>
</JsTsTabs>

#### Protip: remember to `initialize`

Trying to save our user to the database using the default ActiveClass prototype `.save` method will fail without initializing a connection to the Firebase Realtime Database:


<JsTsTabs>
<TabItem value="js">

```js
await user.save()
/*
  ActiveClassError: Failed to save User into database.
  Could not connect to your Firebase database.
  This might be because you have not initialized your Firebase app.
  Try calling Fireactive.initialize
*/
```

</TabItem>
<TabItem value="ts">

```ts
await user.save()
/*
  ActiveClassError: Failed to save User into database.
  Could not connect to your Firebase database.
  This might be because you have not initialized your Firebase app.
  Try calling Fireactive.initialize
*/
```

</TabItem>
</JsTsTabs>

So, let's try following the error and doing just that: [initializing a connection via `Fireactive.initialize`](connecting-101.md)!