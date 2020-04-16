---
id: string
title: String fields
sidebar_label: string
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `Schema.string`

## Basic example
Let's suppose we're modelling information about a dinosaur.

(For now, we'll just store its species as a string, e.g. `'Diplodocus'`.)

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

const dinosaurSchema = {
  species: Schema.string
}

class Dinosaur extends ActiveClass(dinosaurSchema) {}

new Dinosaur() // ActiveClassError: Could not construct Dinosaur. The required property 'species' is missing
new Dinosaur({}) // ActiveClassError: Could not construct Dinosaur. The required property 'species' is missing
new Dinosaur({ species: true }) // ActiveClassError: Could not construct Dinosaur. The property 'species' is of the wrong type
new Dinosaur({ species: null }) // ActiveClassError: Could not construct Dinosaur. The property 'species' is of the wrong type

new Dinosaur({ species: 'Diplodocus', randomProp: 'Triceratops' }) // works (but randomProp gets ignored as it is not on the schema)

new Dinosaur({ species: 'Diplodocus' }) // works
new Dinosaur({ species: 'Triceratops' }) // works
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const dinosaurSchema = {
  species: Schema.string
}

class Dinosaur extends ActiveClass(dinosaurSchema) {}

// Key: * assumes strict null checks

new Dinosaur() // (ts 2554) Expected 1 arguments, but got 0
new Dinosaur({}) // (ts 2354)* Property 'species' is missing in type '{}' but required in...
new Dinosaur({ species: true }) // (ts 2322) Type 'true' is not assignable to type 'string'
new Dinosaur({ species: null }) // (ts 2322)* Type 'null' is not assignable to type 'string'
new Dinosaur({ species: 'Diplodocus', randomProp: 'Triceratops' }) // (ts 2345) Object literal may only specify known properties, and 'randomProp' does not exist in type...

new Dinosaur({ species: 'Diplodocus' }) // compiles
new Dinosaur({ species: 'Triceratops' }) // compiles
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

const dinosaurSchema = {
  species: Schema.string
}

class Dinosaur extends ActiveClass(dinosaurSchema) {}

const dinosaur = new Dinosaur({ species: 4 })
dinosaur.species = 'T-Rex' // works
dinosaur.species = 7 // ActiveClassError: Dinosaur could not accept the value 7 (number) at path 'species'. The property 'species' is of the wrong type
dinosaur.species = undefined // ActiveClassError: Dinosaur could not accept the value undefined (undefined) at path 'species'. The required property 'species' is missing
dinosaur.species = null // ActiveClassError: Dinosaur could not accept the value null (object) at path 'species'. The property 'species' is of the wrong type
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const dinosaurSchema = {
  species: Schema.string
}

class Dinosaur extends ActiveClass(dinosaurSchema) {}

const dinosaur = new Dinosaur({ species: 'Diplodocus' })
dinosaur.species = 'T-Rex' // compiles
dinosaur.species = 7 // (ts 2322) Type '7' is not assignable to type 'string'
dinosaur.species = undefined // (ts 2322) Type 'undefined' is not assignable to type 'string'
dinosaur.species = null // (ts 2322) Type 'null' is not assignable to type 'string'
```

</TabItem>
</Tabs>

## Configuration
A schema property can have a *default* value, **and/or** be *optional*.

In either case, if the property has a default value and/or is optional, it does not need to be supplied when the ActiveRecord is created.

Default values are used when a field's value would otherwise be `undefined`.

Only optional properties can be assigned `null` (i.e. the deliberate ommission of a value).

Let's add some additionl properties to our dinosaur schema to demonstrate:
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

const dinosaurSchema = {
  species: Schema.string,
  doors: Schema.string({ default: 1 }),
  rooms: Schema.string({ optional: true }), // or required: false,
  chimneys: Schema.string({ optional: true, default: 2 })
}

class Dinosaur extends ActiveClass(dinosaurSchema) {}

const dinosaur = new Dinosaur({ species: 4 })
dinosaur.species // => 4
dinosaur.doors // => 1
dinosaur.rooms // => undefined
dinosaur.chimneys // => 2

/* species: required and no default */
dinosaur.species = undefined // ActiveClassError: Dinosaur could not accept the value undefined (undefined) at path 'species'. The required property 'species' is missing
dinosaur.species = null // ActiveClassError: Dinosaur could not accept the value null (object) at path 'species'. The property 'species' is of the wrong type

/* doors: required and has default */
dinosaur.doors = undefined
dinosaur.doors // => false (default kicks in when undefined)
dinosaur.doors = null // ActiveClassError: Dinosaur could not accept the value null (object) at path 'doors'. The property 'doors' is of the wrong type

/* rooms: optional and has no default */
dinosaur.rooms = undefined
dinosaur.rooms // => undefined (optional, so doesn't throw, and has no default to kick in)
dinosaur.rooms = null
dinosaur.rooms // => null (optional, so doesn't throw and can be null)

/* chimneys: optional and has default */
dinosaur.chimneys = undefined
dinosaur.chimneys // => false (default kicks in when undefined)
dinosaur.chimneys = null
dinosaur.chimneys // => null (optional, so doesn't throw and can be null)
```

</TabItem>
<TabItem value='ts'>

| Assignment when | `default` defined | no `default` defined |
|---|---|---|
| **`required: true`** (default) <br/> or **`optional: false`** | `null`: non-assignable <br/> `undefined`: non-assignable | `null`: non-assignable <br/> `undefined`: non-assignable |
| **`optional: true`** <br/> or **`required: false`** | `null`: assignable <br/> `undefined`: non-assignable | `null`: assignable <br /> `undefined`: assignable |

```ts
import { ActiveClass, Schema } from 'fireactive'

const dinosaurSchema = {
  species: Schema.string,
  doors: Schema.string({ default: 1 }),
  rooms: Schema.string({ optional: true }), // or required: false,
  chimneys: Schema.string({ optional: true, default: 2 })
}

class Dinosaur extends ActiveClass(dinosaurSchema) {}

const dinosaur = new Dinosaur({ species: 4 })
dinosaur.species // => 4
dinosaur.doors // => 1
dinosaur.rooms // => undefined
dinosaur.chimneys // => 2

/* species: required and no default */
dinosaur.species = undefined // (ts 2322) Type 'undefined' is not assignable to type 'string'
dinosaur.species = null // (ts 2322) Type 'null' is not assignable to type 'string'

/* doors: required and has default */
dinosaur.doors = undefined // (ts 2322) Type 'undefined' is not assignable to type 'string'
dinosaur.doors = null // (ts 2322) Type 'null' is not assignable to type 'string'

/* rooms: optional and has no default */
dinosaur.rooms = undefined // compiles
dinosaur.rooms = null // compiles

/* chimneys: optional and has default */
dinosaur.chimneys = undefined // (ts 2322) Type 'undefined' is not assignable to type 'string | null'
dinosaur.chimneys = null // compiles
```

</TabItem>
</Tabs>