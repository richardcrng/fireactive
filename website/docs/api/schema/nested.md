---
id: nested
title: Nested Schema
sidebar_label: Nested
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Link from '@docusaurus/Link';


A basic schema is an object where every value is either:

- One of the primitive `Schema` types
  - <Link to='/docs/api/schema/types/boolean'>`Schema.boolean`</Link>
  - <Link to='/docs/api/schema/types/enum'>`Schema.enum`</Link>
  - <Link to='/docs/api/schema/types/number'>`Schema.number`</Link>
  - <Link to='/docs/api/schema/types/string'>`Schema.string`</Link>
- One of the indexed `Schema` types
  - <Link to='/docs/api/schema/types/indexed'>`Schema.indexed.boolean`</Link>
  - <Link to='/docs/api/schema/types/indexed'>`Schema.indexed.enum`</Link>
  - <Link to='/docs/api/schema/types/indexed'>`Schema.indexed.number`</Link>
  - <Link to='/docs/api/schema/types/indexed'>`Schema.indexed.string`</Link>
  - <Link to='/docs/api/schema/types/indexed'>`Schema.indexed.true`</Link>

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