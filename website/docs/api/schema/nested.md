---
id: nested
title: Nested Schema
sidebar_label: Nested
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A basic schema is an object where every value is either:

- One of the primitive `Schema` types
  - [`Schema.boolean`](types/boolean)
  - [`Schema.enum`](types/enum)
  - [`Schema.number`](types/number)
  - [`Schema.string`](types/string)
- One of the indexed `Schema` types
  - [`Schema.indexed.boolean`](types/indexed)
  - [`Schema.indexed.enum`](types/indexed)
  - [`Schema.indexed.number`](types/indexed)
  - [`Schema.indexed.string`](types/indexed)
  - [`Schema.indexed.true`](types/indexed)

These can be nested within objects to create nested schema.

<JsTsTabs>
<TabItem value='js'>

```js
const countrySchema = {
  name: Schema.string,
  continent: Schema.enum(['Asia', 'Africa', 'Europe', 'Australia', 'North America', 'South America', 'Antarctica']),
  population: Schema.number
  capital: {
    name: Schema.string,
    population: Schema.number
  }
}

class Country extends ActiveClass(countrySchema) {}
```

</TabItem>
</JsTsTabs>