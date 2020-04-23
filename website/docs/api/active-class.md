---
id: active-class
title: ActiveClass
sidebar_label: Overview
---

import JsTsTabs, { JsTab, TsTab } from '../../src/lib/atoms/JsTsTabs'
import TabItem from '@theme/TabItem';
import Link from '@docusaurus/Link';

In Fireactive, 'ActiveClass' can refer both to:

1. an ES6 Class that is used to interact with a particular store of entities; and
2. the library export, `ActiveClass` that is used in the creation of these ActiveClasses.

More concretely:

<JsTsTabs>
<TabItem value='js'>

```js
import { Schema, ActiveClass } from 'fireactive'

const personSchema = {
  name: Schema.string,
  age: Schema.number
}

class Person extends ActiveClass(personSchema) {}
```

</TabItem>
<TabItem value='ts'>

```ts
import { Schema, ActiveClass } from 'fireactive'

const personSchema = {
  name: Schema.string,
  age: Schema.number
}

class Person extends ActiveClass(personSchema) {}
```

</TabItem>
</JsTsTabs>

In the above code, `Person` is an **ActiveClass**. It represents person entities: JavaScript objects that have both a `name` property (as a string) and an `age` property (as a number).

It has been created by extending the `ActiveClass` export (passed a <Link to='/docs/api/schema'>Schema</Link>).

