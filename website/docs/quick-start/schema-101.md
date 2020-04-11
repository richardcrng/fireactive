---
id: schema-101
title: Creating a Schema
sidebar_label: Creating a Schema
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Why use a `Schema`?

Schemas are the key to providing predictable data, autocomplete and type-checking in your [ActiveClasses](active-class-101.md).

<img alt="VS Code Autocomplete with Fireactive" src={useBaseUrl('img/fireactive-autocomplete.png')} />

## Writing a basic `Schema`

Let's say that we want to model a user. Here's how we might do it.

<Tabs
  defaultValue="js"
  values={[
    { label: 'JavaScript', value: 'js', },
    { label: 'TypeScript', value: 'ts', }
  ]}
>
<TabItem value="js">

```js
import { Schema } from 'fireactive'

const userSchema = {
  name: Schema.string,  // users must have a name
  age: Schema.number({ optional: true }), // age is optional
  role: Schema.enum(['admin', 'basic']), // role must be 'admin' or 'basic'
  isVerified: Schema.boolean({ default: false }) // defaults to false
}
```

</TabItem>
<TabItem value="ts">

```ts
import { Schema } from 'fireactive'

const userSchema = {
  name: Schema.string,  // users must have a name
  age: Schema.number({ optional: true }), // age is optional
  role: Schema.enum(['admin', 'basic']), // role must be 'admin' or 'basic'
  isVerified: Schema.boolean({ default: false }) // defaults to false
}
```

</TabItem>
</Tabs>

`Schema` fields are all required, unless explicitly passed either `{ optional: true }` or `{ required: false }` as options.

Now you've written a `Schema`, you're ready to create your first Fireactive `ActiveClass`!


