---
id: active-document
title: ActiveDocument
sidebar_label: Overview
---

import JsTsTabs, { JsTab, TsTab } from '../../src/lib/atoms/JsTsTabs'
import TabItem from '@theme/TabItem';
import Link from '@docusaurus/Link';

## Terminology

In Fireactive, an ActiveDocument is an instance of an <Link to='/docs/api/active-class'>ActiveClass</Link>.

More concretely:

<JsTsTabs>
<TabItem value='js'>

```js
import { Schema, ActiveClass } from 'fireactive'

// define schema for ActiveClass
const animalSchema = {
  name: Schema.string,
  age: Schema.number
}

// create the ActiveClass
class Animal extends ActiveClass(animalSchema) {}

// instantiate the ActiveClass for an ActiveRecord
const mog = new Animal({ name: 'Mog', age: 4 })
```

</TabItem>
<TabItem value='ts'>

```ts
import { Schema, ActiveClass } from 'fireactive'

// define schema for ActiveClass
const animalSchema = {
  name: Schema.string,
  age: Schema.number
}

// create the ActiveClass
class Animal extends ActiveClass(animalSchema) {}

// instantiate the ActiveClass for an ActiveRecord
const mog = new Animal({ name: 'Mog', age: 4 })
```

</TabItem>
</JsTsTabs>

In the above code, `mog` is an **ActiveDocument**, since it is an instance of `Animal` (which is an **ActiveClass**).