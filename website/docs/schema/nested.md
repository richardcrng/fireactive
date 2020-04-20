---
id: nested
title: Nested Schema
sidebar_label: Nested
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A basic schema is an object where every value is either:

- One of the primitive `Schema` types
  - [`Schema.boolean`](types/boolean.md)
  - [`Schema.enum`](types/enum.md)
  - [`Schema.number`](types/number.md)
  - [`Schema.string`](types/string.md)
- One of the indexed `Schema` types
  - [`Schema.indexed.boolean`](types/indexed.md)
  - [`Schema.indexed.enum`](types/indexed.md)
  - [`Schema.indexed.number`](types/indexed.md)
  - [`Schema.indexed.string`](types/indexed.md)
  - [`Schema.indexed.true`](types/indexed.md)

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