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

Now you have made a connection to your Firebase Realtime Database, you can [save an ActiveClass instance without throwing the error we saw before](active-class-101.md):

<JsTsTabs>
<TabItem value="js">

```js
const user = new User({ name: 'Richard', role: 'admin' })
user._id // => undefined
await user.save()
user._id // => "-JhLeOlGIEjaIOFHR0xd" (or similar)
/* 
  When our User is saved into the Firebase
    Realtime Database, it gains an `_id`
    if it didn't already have one before.
*/
```

</TabItem>
<TabItem value="ts">

```ts
const user = new User({ name: 'Richard' })
await user.save()
user._id // => "-JhLeOlGIEjaIOFHR0xd" (or similar)
/* 
  When our User is saved into the Firebase
    Realtime Database, it gains an `_id`
    if it didn't already have one before.
*/
```

</TabItem>
</JsTsTabs>