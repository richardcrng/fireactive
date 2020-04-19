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

const schema = {
  booleanVals: Schema.indexed.boolean,
  fooOrBarVals: Schema.indexed.enum(['foo', 'bar']),
  numberVals: Schema.indexed.number,
  stringVals: Schema.indexed.string,
  trueVals: Schema.indexed.true
}

class Dictionary extends ActiveClass(schema) {}

new Dictionary({ booleanVals: { test: 'false' } }) // (ts 2332) Type 'string' is not assignable to type 'true'
new Dictionary({ booleanVals: { test: false } }) // compiles

new Dictionary({ fooOrBarVals: { test: 'foobar' } }) // (ts 2332) Type '"foobar"' is not assignable to type '"bar"'
new Dictionary({ fooOrBarVals: { test: 'foo' } }) // compiles

new Dictionary({ numberVals: { test: '5' } }) // (ts 2332) Type 'string' is not assignable to type 'number'
new Dictionary({ numberVals: { test: 5 } }) // compiles

new Dictionary({ stringVals: { test: 5 } }) // (ts 2332) Type 'number' is not assignable to type 'string'
new Dictionary({ stringVals: { test: '5' } }) // compiles

new Dictionary({ trueVals: { test: false } }) // (ts 2332) Type 'false' is not assignable to type 'true'
new Dictionary({ trueVals: { test: true } }) // compiles
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

const schema = {
  booleanVals: Schema.indexed.boolean,
  fooOrBarVals: Schema.indexed.enum(['foo', 'bar']),
  numberVals: Schema.indexed.number,
  stringVals: Schema.indexed.string,
  trueVals: Schema.indexed.true
}

class Dictionary extends ActiveClass(schema) {}

const dictionary = new Dictionary({})
dictionary.booleanVals // => {}
dictionary.fooOrBarVals // => {}
dictionary.numberVals // => {}
dictionary.stringVals // => {}
dictionary.trueVals // => {}

dictionary.booleanVals.someProp = 'false' // ActiveClassError: Dictionary could not accept the value "false" (string) at path 'booleanVals.someProp'. The property 'booleanVals' is of the wrong type
dictionary.booleanVals.someProp = false // works

dictionary.fooOrBarVals.someProp = 'BAR' // ActiveClassError: Dictionary could not accept the value "BAR" (string) at path 'fooOrBarVals.someProp'. The property 'fooOrBarVals' is of the wrong type
dictionary.fooOrBarVals.someProp = 'bar' // works

dictionary.numberVals.someProp = '5' // ActiveClassError: Dictionary could not accept the value "5" (string) at path 'numberVals.someProp'. The property 'numberVals' is of the wrong type
dictionary.numberVals.someProp = 5 // works

dictionary.stringVals.someProp = 5 // ActiveClassError: Dictionary could not accept the value 5 (number) at path 'stringVals.someProp'. The property 'stringVals' is of the wrong type
dictionary.stringVals.someProp = '5' // works

dictionary.trueVals.someProp = false // ActiveClassError: Dictionary could not accept the value false (boolean) at path 'trueVals.someProp'. The property 'trueVals' is of the wrong type
dictionary.trueVals.someProp = true // works
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const dictionarySchema = {
  floors: Schema.indexed
}

class Dictionary extends ActiveClass(dictionarySchema) {}

const dictionary = new Dictionary({ floors: 4 })
dictionary.floors = 5 // compiles
dictionary.floors = '5' // (ts 2322) Type '"5"' is not assignable to type 'indexed'
dictionary.floors = undefined // (ts 2322) Type 'undefined' is not assignable to type 'indexed'
dictionary.floors = null // (ts 2322) Type 'null' is not assignable to type 'indexed'
```

</TabItem>
</Tabs>

## Configuration
A schema property can have a *default* value, **and/or** be *optional*.

In either case, if the property has a default value and/or is optional, it does not need to be supplied when the ActiveRecord is created.

Default values are used when a field's value would otherwise be `undefined`.

Only optional properties can be assigned `null` (i.e. the deliberate ommission of a value).

Let's add some additionl properties to our dictionary schema to demonstrate:
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

const dictionarySchema = {
  floors: Schema.indexed,
  doors: Schema.indexed({ default: 1 }),
  rooms: Schema.indexed({ optional: true }), // or required: false,
  chimneys: Schema.indexed({ optional: true, default: 2 })
}

class Dictionary extends ActiveClass(dictionarySchema) {}

const dictionary = new Dictionary({ floors: 4 })
dictionary.floors // => 4
dictionary.doors // => 1
dictionary.rooms // => undefined
dictionary.chimneys // => 2

/* floors: required and no default */
dictionary.floors = undefined // ActiveClassError: Dictionary could not accept the value undefined (undefined) at path 'floors'. The required property 'floors' is missing
dictionary.floors = null // ActiveClassError: Dictionary could not accept the value null (object) at path 'floors'. The property 'floors' is of the wrong type

/* doors: required and has default */
dictionary.doors = undefined
dictionary.doors // => false (default kicks in when undefined)
dictionary.doors = null // ActiveClassError: Dictionary could not accept the value null (object) at path 'doors'. The property 'doors' is of the wrong type

/* rooms: optional and has no default */
dictionary.rooms = undefined
dictionary.rooms // => undefined (optional, so doesn't throw, and has no default to kick in)
dictionary.rooms = null
dictionary.rooms // => null (optional, so doesn't throw and can be null)

/* chimneys: optional and has default */
dictionary.chimneys = undefined
dictionary.chimneys // => false (default kicks in when undefined)
dictionary.chimneys = null
dictionary.chimneys // => null (optional, so doesn't throw and can be null)
```

</TabItem>
<TabItem value='ts'>

| Assignment when | `default` defined | no `default` defined |
|---|---|---|
| **`required: true`** (default) <br/> or **`optional: false`** | `null`: non-assignable <br/> `undefined`: non-assignable | `null`: non-assignable <br/> `undefined`: non-assignable |
| **`optional: true`** <br/> or **`required: false`** | `null`: assignable <br/> `undefined`: non-assignable | `null`: assignable <br /> `undefined`: assignable |

```ts
import { ActiveClass, Schema } from 'fireactive'

const dictionarySchema = {
  floors: Schema.indexed,
  doors: Schema.indexed({ default: 1 }),
  rooms: Schema.indexed({ optional: true }), // or required: false,
  chimneys: Schema.indexed({ optional: true, default: 2 })
}

class Dictionary extends ActiveClass(dictionarySchema) {}

const dictionary = new Dictionary({ floors: 4 })
dictionary.floors // => 4
dictionary.doors // => 1
dictionary.rooms // => undefined
dictionary.chimneys // => 2

/* floors: required and no default */
dictionary.floors = undefined // (ts 2322) Type 'undefined' is not assignable to type 'indexed'
dictionary.floors = null // (ts 2322) Type 'null' is not assignable to type 'indexed'

/* doors: required and has default */
dictionary.doors = undefined // (ts 2322) Type 'undefined' is not assignable to type 'indexed'
dictionary.doors = null // (ts 2322) Type 'null' is not assignable to type 'indexed'

/* rooms: optional and has no default */
dictionary.rooms = undefined // compiles
dictionary.rooms = null // compiles

/* chimneys: optional and has default */
dictionary.chimneys = undefined // (ts 2322) Type 'undefined' is not assignable to type 'indexed | null'
dictionary.chimneys = null // compiles
```

</TabItem>
</Tabs>