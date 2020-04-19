---
id: indexed
title: Indexed fields
sidebar_label: indexed
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `Schema.indexed`

The typical use case for a `Schema.indexed` field is to [model one-to-many relations](../relations/simple/one-to-many-101.md).

A field which is typed using `Schema.indexed[type]` structures an object which has arbitrary keys, each of which has a value that conform to `type`, e.g.:

- `Schema.indexed.boolean` structures an object with boolean values
- `Schema.indexed.enum` structures an object with values from a set
- `Schema.indexed.number` structures an object with number values
- `Schema.indexed.string` structures an object with string values
- `Schema.indexed.true` structures an object where every value is `true`

## Basic example

### Creation
<Tabs
  defaultValue="js"
  values={[
    { label: 'Run-time type checks (JS)', value: 'js', },
    { label: 'Static / compilation type checks (TS)', value: 'ts', }
  ]}
>
<TabItem value='js'>

```js
import { ActiveClass, Schema } from 'fireactive'

const schema = {
  booleanVals: Schema.indexed.boolean,
  fooOrBarVals: Schema.indexed.enum(['foo', 'bar']),
  numberVals: Schema.indexed.number,
  stringVals: Schema.indexed.string,
  trueVals: Schema.indexed.true
}

class Dictionary extends ActiveClass(schema) {}

new Dictionary({ booleanVals: { test: 'false' } }) // ActiveClassError: Could not construct Dictionary. The property 'booleanVals' is of the wrong type
new Dictionary({ booleanVals: { test: false } }) // works

new Dictionary({ fooOrBarVals: { test: 'foobar' } }) // ActiveClassError: Could not construct Dictionary. The property 'fooOrBarVals' is of the wrong type
new Dictionary({ fooOrBarVals: { test: 'foo' } }) // works

new Dictionary({ numberVals: { test: '5' } }) // ActiveClassError: Could not construct Dictionary. The property 'numberVals' is of the wrong type
new Dictionary({ numberVals: { test: 5 } }) // works

new Dictionary({ stringVals: { test: 5 } }) // ActiveClassError: Could not construct Dictionary. The property 'stringVals' is of the wrong type
new Dictionary({ stringVals: { test: '5' } }) // works

new Dictionary({ trueVals: { test: false } }) // ActiveClassError: Could not construct Dictionary. The property 'trueVals' is of the wrong type
new Dictionary({ trueVals: { test: true } }) // works
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const buildingSchema = {
  floors: Schema.indexed
}

class Dictionary extends ActiveClass(buildingSchema) {}

// Key: * assumes strict null checks

new Dictionary() // (ts 2554) Expected 1 arguments, but got 0
new Dictionary({}) // (ts 2354)* Property 'floors' is missing in type '{}' but required in...
new Dictionary({ floors: '4' }) // (ts 2322) Type 'string' is not assignable to type 'indexed'
new Dictionary({ floors: null }) // (ts 2322)* Type 'null' is not assignable to type 'indexed'
new Dictionary({ floors: 4, randomProp: 9 }) // (ts 2345) Object literal may only specify known properties, and 'randomProp' does not exist in type...

new Dictionary({ floors: 4 }) // compiles
new Dictionary({ floors: 9 }) // compiles
```

</TabItem>
</Tabs>

### Assignment
<Tabs
  defaultValue="js"
  values={[
    { label: 'Run-time type checks (JS)', value: 'js', },
    { label: 'Static / compilation type checks (TS)', value: 'ts', }
  ]}
>
<TabItem value='js'>

```js
import { ActiveClass, Schema } from 'fireactive'

const buildingSchema = {
  floors: Schema.indexed
}

class Dictionary extends ActiveClass(buildingSchema) {}

const building = new Dictionary({ floors: 4 })
building.floors = 5 // works
building.floors = '5' // ActiveClassError: Dictionary could not accept the value "5" (string) at path 'floors'. The property 'floors' is of the wrong type
building.floors = undefined // ActiveClassError: Dictionary could not accept the value undefined (undefined) at path 'floors'. The required property 'floors' is missing
building.floors = null // ActiveClassError: Dictionary could not accept the value null (object) at path 'floors'. The property 'floors' is of the wrong type
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const buildingSchema = {
  floors: Schema.indexed
}

class Dictionary extends ActiveClass(buildingSchema) {}

const building = new Dictionary({ floors: 4 })
building.floors = 5 // compiles
building.floors = '5' // (ts 2322) Type '"5"' is not assignable to type 'indexed'
building.floors = undefined // (ts 2322) Type 'undefined' is not assignable to type 'indexed'
building.floors = null // (ts 2322) Type 'null' is not assignable to type 'indexed'
```

</TabItem>
</Tabs>

## Configuration
A schema property can have a *default* value, **and/or** be *optional*.

In either case, if the property has a default value and/or is optional, it does not need to be supplied when the ActiveRecord is created.

Default values are used when a field's value would otherwise be `undefined`.

Only optional properties can be assigned `null` (i.e. the deliberate ommission of a value).

Let's add some additionl properties to our building schema to demonstrate:
* `doors` should default to `1`;
* `rooms`, should be an optional property;
* `chimneys`, should default to `2` *and* be an optional property.

<Tabs
  defaultValue="js"
  values={[
    { label: 'Runtime type checks (JS)', value: 'js', },
    { label: 'Static / compile-time type checks (TS)', value: 'ts', }
  ]}
>
<TabItem value='js'>

| Assignment when | `default` defined | no `default` defined |
|---|---|---|
| **`required: true`** (default) <br/> or **`optional: false`** | `null`: throws <br/> `undefined`: uses `default` | `null`: throws <br/> `undefined`: throws |
| **`optional: true`** <br/> or **`required: false`** | `null`: uses `null` <br/> `undefined`: uses `default` | `null`: uses `null` <br /> `undefined`: uses `undefined` |

```js
import { ActiveClass, Schema } from 'fireactive'

const buildingSchema = {
  floors: Schema.indexed,
  doors: Schema.indexed({ default: 1 }),
  rooms: Schema.indexed({ optional: true }), // or required: false,
  chimneys: Schema.indexed({ optional: true, default: 2 })
}

class Dictionary extends ActiveClass(buildingSchema) {}

const building = new Dictionary({ floors: 4 })
building.floors // => 4
building.doors // => 1
building.rooms // => undefined
building.chimneys // => 2

/* floors: required and no default */
building.floors = undefined // ActiveClassError: Dictionary could not accept the value undefined (undefined) at path 'floors'. The required property 'floors' is missing
building.floors = null // ActiveClassError: Dictionary could not accept the value null (object) at path 'floors'. The property 'floors' is of the wrong type

/* doors: required and has default */
building.doors = undefined
building.doors // => false (default kicks in when undefined)
building.doors = null // ActiveClassError: Dictionary could not accept the value null (object) at path 'doors'. The property 'doors' is of the wrong type

/* rooms: optional and has no default */
building.rooms = undefined
building.rooms // => undefined (optional, so doesn't throw, and has no default to kick in)
building.rooms = null
building.rooms // => null (optional, so doesn't throw and can be null)

/* chimneys: optional and has default */
building.chimneys = undefined
building.chimneys // => false (default kicks in when undefined)
building.chimneys = null
building.chimneys // => null (optional, so doesn't throw and can be null)
```

</TabItem>
<TabItem value='ts'>

| Assignment when | `default` defined | no `default` defined |
|---|---|---|
| **`required: true`** (default) <br/> or **`optional: false`** | `null`: non-assignable <br/> `undefined`: non-assignable | `null`: non-assignable <br/> `undefined`: non-assignable |
| **`optional: true`** <br/> or **`required: false`** | `null`: assignable <br/> `undefined`: non-assignable | `null`: assignable <br /> `undefined`: assignable |

```ts
import { ActiveClass, Schema } from 'fireactive'

const buildingSchema = {
  floors: Schema.indexed,
  doors: Schema.indexed({ default: 1 }),
  rooms: Schema.indexed({ optional: true }), // or required: false,
  chimneys: Schema.indexed({ optional: true, default: 2 })
}

class Dictionary extends ActiveClass(buildingSchema) {}

const building = new Dictionary({ floors: 4 })
building.floors // => 4
building.doors // => 1
building.rooms // => undefined
building.chimneys // => 2

/* floors: required and no default */
building.floors = undefined // (ts 2322) Type 'undefined' is not assignable to type 'indexed'
building.floors = null // (ts 2322) Type 'null' is not assignable to type 'indexed'

/* doors: required and has default */
building.doors = undefined // (ts 2322) Type 'undefined' is not assignable to type 'indexed'
building.doors = null // (ts 2322) Type 'null' is not assignable to type 'indexed'

/* rooms: optional and has no default */
building.rooms = undefined // compiles
building.rooms = null // compiles

/* chimneys: optional and has default */
building.chimneys = undefined // (ts 2322) Type 'undefined' is not assignable to type 'indexed | null'
building.chimneys = null // compiles
```

</TabItem>
</Tabs>