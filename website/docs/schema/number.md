---
id: number
title: Number fields
sidebar_label: number
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `Schema.number`

## Basic example
Let's suppose we're modelling a building, which has a number of floors.

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

const buildingSchema = {
  floors: Schema.number
}

class Building extends ActiveClass(buildingSchema) {}

new Building() // ActiveClassError: Could not construct Building. The required property 'floors' is missing
new Building({}) // ActiveClassError: Could not construct Building. The required property 'floors' is missing
new Building({ floors: '4' }) // ActiveClassError: Could not construct Building. The property 'floors' is of the wrong type
new Building({ floors: null }) // ActiveClassError: Could not construct Building. The property 'floors' is of the wrong type

new Building({ floors: 4, randomProp: 9 }) // works (but randomProp gets ignored as it is not on the schema)

new Building({ floors: 4 }) // works
new Building({ floors: 9 }) // works
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const buildingSchema = {
  floors: Schema.number
}

class Building extends ActiveClass(buildingSchema) {}

// Key: * assumes strict null checks

new Building() // (ts 2554) Expected 1 arguments, but got 0
new Building({}) // (ts 2354)* Property 'floors' is missing in type '{}' but required in...
new Building({ floors: '4' }) // (ts 2322) Type 'string' is not assignable to type 'number'
new Building({ floors: null }) // (ts 2322)* Type 'null' is not assignable to type 'number'
new Building({ floors: 4, randomProp: 9 }) // (ts 2345) Object literal may only specify known properties, and 'randomProp' does not exist in type...

new Building({ floors: 4 }) // compiles
new Building({ floors: 9 }) // compiles
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
  floors: Schema.number
}

class Building extends ActiveClass(buildingSchema) {}

const building = new Building({ floors: 4 })
building.floors = 5 // works
building.floors = '5' // ActiveClassError: Building could not accept the value "true" (string) at path 'floors'. The property 'floors' is of the wrong type
building.floors = undefined // ActiveClassError: Building could not accept the value undefined (undefined) at path 'floors'. The required property 'floors' is missing
building.floors = null // ActiveClassError: Building could not accept the value null (object) at path 'floors'. The property 'floors' is of the wrong type
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const buildingSchema = {
  floors: Schema.number
}

class Building extends ActiveClass(buildingSchema) {}

const building = new Building({ floors: 4 })
building.floors = 5 // compiles
building.floors = '5' // (ts 2322) Type '"5"' is not assignable to type 'number'
building.floors = undefined // (ts 2322) Type 'undefined' is not assignable to type 'number'
building.floors = null // (ts 2322) Type 'null' is not assignable to type 'number'
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
  floors: Schema.number,
  doors: Schema.number({ default: 1 }),
  rooms: Schema.number({ optional: true }), // or required: false,
  chimneys: Schema.number({ optional: true, default: 2 })
}

class Building extends ActiveClass(buildingSchema) {}

const building = new Building({ floors: 4 })
building.floors // => 4
building.doors // => 1
building.rooms // => undefined
building.chimneys // => 2

/* floors: required and no default */
building.floors = undefined // ActiveClassError: Building could not accept the value undefined (undefined) at path 'floors'. The required property 'floors' is missing
building.floors = null // ActiveClassError: Building could not accept the value null (object) at path 'floors'. The property 'floors' is of the wrong type

/* doors: required and has default */
building.doors = undefined
building.doors // => false (default kicks in when undefined)
building.doors = null // ActiveClassError: Building could not accept the value null (object) at path 'doors'. The property 'doors' is of the wrong type

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
  floors: Schema.number,
  doors: Schema.number({ default: 1 }),
  rooms: Schema.number({ optional: true }), // or required: false,
  chimneys: Schema.number({ optional: true, default: 2 })
}

class Building extends ActiveClass(buildingSchema) {}

const building = new Building({ floors: 4 })
building.floors // => 4
building.doors // => 1
building.rooms // => undefined
building.chimneys // => 2

/* floors: required and no default */
building.floors = undefined // (ts 2322) Type 'undefined' is not assignable to type 'number'
building.floors = null // (ts 2322) Type 'null' is not assignable to type 'number'

/* doors: required and has default */
building.doors = undefined // (ts 2322) Type 'undefined' is not assignable to type 'number'
building.doors = null // (ts 2322) Type 'null' is not assignable to type 'number'

/* rooms: optional and has no default */
building.rooms = undefined // compiles
building.rooms = null // compiles

/* chimneys: optional and has default */
building.chimneys = undefined // (ts 2322) Type 'undefined' is not assignable to type 'number | null'
building.chimneys = null // compiles
```

</TabItem>
</Tabs>