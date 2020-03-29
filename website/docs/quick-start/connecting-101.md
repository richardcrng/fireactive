---
id: connecting-101
title: Connecting to Firebase
sidebar_label: Connecting to Firebase
---

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

## Why connect to Firebase?

By connecting your ActiveClasses to Firebase, you gain the power of default realtime sync to and from your Firebase Realtime Database for your ActiveClass and all its instances.

## Basic operations with Firebase
### Connecting with `initialize`

To connect your ActiveClasses to Firebase, call the `initialize` export from Fireactive with a config object that includes your Firebase Realtime Database URL:

<JsTsTabs>
<TabItem value="js">

```js
import { initialize } from 'fireactive'

initialize({
  // put your database url below
  databaseURL: 'https://some-database-url.firebaseio.com'
}) // => returns Firebase app instance
```

</TabItem>
<TabItem value="ts">

```ts
import { initialize } from 'fireactive'

initialize({
  // put your database url below
  databaseURL: 'https://some-database-url.firebaseio.com'
})
```

</TabItem>
</JsTsTabs>

### Saving data with `.save`

Now you have made a connection to your Firebase Realtime Database, you can [save a given ActiveRecord without throwing the error we saw before](active-class-101.md):

<JsTsTabs>
<TabItem value="js">

```js
const richard = new User({ name: 'Richard', role: 'admin' })
richard._id // => undefined
await richard.save()
richard._id // => "-JhLeOlGIEjaIOFHR0xd" (or similar)
/* 
  When our User is saved into the Firebase
    Realtime Database, it gains an `_id`
    if it didn't already have one before.
*/
```

</TabItem>
<TabItem value="ts">

```ts
const richard = new User({ name: 'Richard', role: 'admin' })
richard._id // => undefined
await richard.save()
richard._id // => "-JhLeOlGIEjaIOFHR0xd" (or similar)
/* 
  When our User is saved into the Firebase
    Realtime Database, it gains an `_id`
    if it didn't already have one before.
*/
```

</TabItem>
</JsTsTabs>

### Inserting data with `.create`

Rather than using the `new` operator to instantiate an ActiveRecord and then separately calling `.save`, you can use `.create` to achieve both in one line:

<JsTsTabs>
<TabItem value="js">

```js
/*
  `.create` returns a promise that resolves when
    the data has been written to the database
*/
const chuck = await User.create({ name: 'Chuck Norris', role: 'admin' })
/* 
  Our User has an `_id` because it is already
    saved in the Firebase Realtime Database.
*/
chuck._id // => "-JhQ76OEK_848CkIFhAq" (or similar)
```

</TabItem>
<TabItem value="ts">

```ts
/*
  `.create` returns a promise that resolves when
    the data has been written to the database
*/
const chuck = await User.create({ name: 'Chuck Norris', role: 'admin' })
/* 
  Our User has an `_id` because it is already
    saved in the Firebase Realtime Database.
*/
chuck._id // => "-JhQ76OEK_848CkIFhAq" (or similar)
```

</TabItem>
</JsTsTabs>

### Fetching data with `.find`

You can read data from your database with the static `.find` method on an ActiveClass.

For example, we've created two different users who are both admins - let's retrieve them both.

<JsTsTabs>
<TabItem value="js">

```js
// `.find` returns an array of matches
const admins = User.find({ role: 'admin' })
admins[0].name // => 'Richard'
admins[1].name // => 'Chuck Norris'
```

</TabItem>
<TabItem value="ts">

```ts
// `.find` returns an array of matches
const admins = User.find({ role: 'admin' })
admins[0].name // => 'Richard'
admins[1].name // => 'Chuck Norris'
```

</TabItem>
</JsTsTabs>

There are also static methods `.findOne` or `.findById`, which return a single ActiveRecord.