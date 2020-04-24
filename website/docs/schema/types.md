---
id: overview
title: Schema
sidebar_label: Overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`Schema` is one of the main exports from Fireactive.

You should use `Schema` to provide a predictable structure to your ActiveClasses.

Schemas are used by ActiveClasses to:
- provide runtime type-checking on instances; and
- provide static type-checking in TypeScript (without additional type declarations).

## Examples

### Basic usage
Let's suppose we're storing user data.

For the sake of argument, let's suppose that users all:
- have a name, which should be a `string`;
- have an age, which should be a `number`;
- have a role, which must be either the string `'admin'` or `'basic'`
  - (i.e. as a type it should satisfy an `enum` of the two);
- have a verified status, which should be a `boolean`.

```js
import { Schema } from 'fireactive'

let userSchema = {
  name: Schema.string,
  age: Schema.number,
  role: Schema.enum(['admin', 'basic']),
  isVerified: Schema.boolean
}
```

### Simple configuration
Schema fields are required (and therefore must always exist on a document) unless configured otherwise.

Suppose we want to tweak our schema in the following way therefore:

- `age` should be optional;
- `role` should default to `'basic'` on initialization; and
- `isVerified` should be optional but also default to `false` on initialization.

```js
let userSchema = {
  name: Schema.string,
  age: Schema.number({ optional: true }),
  role: Schema.enum(['admin', 'basic'], { default: 'basic' }),
  isVerified: Schema.boolean({ required: false, default: false })
}
```

Note that `optional: true` and `required: false` achieve the same thing, so you can use whichever you prefer the semantics of.

## Available types
- [`Schema.boolean`](boolean.md)
- [`Schema.enum`](enum.md)
- [`Schema.indexed`](indexed.md)
- [`Schema.number`](number.md)
- [`Schema.string`](string.md)
