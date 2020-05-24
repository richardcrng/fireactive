---
id: schema-101
title: Creating a Schema
sidebar_label: Creating a Schema
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TabItem from '@theme/TabItem';
import JsTsTabs from '../../src/lib/atoms/JsTsTabs';
import Link from '@docusaurus/Link'

## Why use a `Schema`?

Schemas are the key to providing predictable data, autocomplete and type-checking in your <Link to='/docs/quick-start/active-class-101'>ActiveClasses</Link>.

<img alt="VS Code Autocomplete with Fireactive" src={useBaseUrl('img/fireactive-autocomplete.png')} />

## Writing a basic `Schema`

Let's say that we want to model a user. Here's how we might do it.

<JsTsTabs>
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
</JsTsTabs>

`Schema` fields are all required, unless explicitly passed either `{ optional: true }` or `{ required: false }` as options.

Now you've written a `Schema`, you're ready to create your first Fireactive `ActiveClass`!


