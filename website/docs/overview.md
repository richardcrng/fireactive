---
id: overview
title: Overview
sidebar_label: Overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Why?

The [Firebase Realtime Database](https://firebase.google.com/docs/database) is great because it:

- **syncs realtime data** between devices, no HTTP requests needed;
- can be **used directly in client-side code**, no backend server needed; and
- **enables offline persistence** in the absence of a connection.

But there are some pain points when using it with the [JavaScript SDK](https://firebase.google.com/docs/reference/js):

1. It can be **cumbersome and repetitive** to read data and set up listeners to sync data;
2. It is **easy to forget the precise structure** of [your NoSQL database](https://firebase.google.com/docs/database/web/structure-data) when writing your code; and
3. There is **no autocomplete or type-checking** on data read from the database.

## How?

Fireactive was built with three goals in mind:

1. **Easy APIs for data syncing (active by default)** to and from your Realtime Database;
2. **Predictable data with an explicit model-based structure** for objects and your database; and
3. **Code autocomplete and type-checking** with VS Code and/or TypeScript.

## What?

Fireactive is a strongly-typed Object Document Mapper with realtime syncing enabled by default for all data that is created, read or updated in your Firebase Realtime Database.

This is achieved through *Schema*-based *ActiveClass*es.

<Tabs
  defaultValue="js"
  values={[
    { label: 'JavaScript', value: 'js', },
    { label: 'TypeScript', value: 'ts', }
  ]}
>
<TabItem value="js">

```js
import { ActiveClass, Schema } from 'fireactive'

// A schema for user data
const userSchema = {
  name: Schema.string,  // users must have a name
  age: Schema.number({ optional: true }), // age is optional
  role: Schema.enum(['admin', 'basic']), // role must be 'admin' or 'basic'
  isVerified: Schema.boolean({ default: false }) // defaults to false
}

// Create an active class based on this schema
class User extends ActiveClass(userSchema) {}
```

</TabItem>
<TabItem value="ts">
A lot of the typings are given by default.
<br />
<br />

```ts
import { ActiveClass, Schema } from 'fireactive'

// A schema for user data
const userSchema = {
  name: Schema.string,  // users must have a name
  age: Schema.number({ optional: true }), // age is optional
  role: Schema.enum(['admin', 'basic']), // role must be 'admin' or 'basic'
  isVerified: Schema.boolean({ default: false }) // defaults to false
}

// Create an active class based on this schema
class User extends ActiveClass(userSchema) {}
```

</TabItem>
</Tabs>

A Fireactive `ActiveClass` provides some helpful static and prototype methods by default, although you are free to add your own in when extending.


