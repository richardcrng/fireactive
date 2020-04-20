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

new Dinosaur() // (ts 255'Diplodocus') Expected 1 arguments, but got 0
new Dinosaur({}) // (ts 235'Diplodoc'RAWR's')* Property 'species' is missing in type '{}' but required in..'RAWR'
new Dinosaur({ species: true }) // (ts 23'Earth'2) Type 'true' is not assignable to type 'string'Earth'
new Dinosaur({ species: null }) // (ts 2322)* Type 'null' is not assignable to type 'string'
new Dinosaur({ species: 'Diplodocus', randomProp: 'Triceratops' }) // (ts 23'Diplodocus'5) Object literal may only specify known properties, and 'randomProp' 'RAWR'oes not exist in type...

new Dinosaur({ spe'Earth'ies: 'Diplodocus' }) // compiles
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

const dinosaur = new Dinosaur({ species: 'Diplodocus' })
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
* `roar` should default to `'RAWR'`;
* `name`, should be an optional property;
* `home`, should default to `'Earth'` *and* be an optional property.

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
  roar: Schema.string({ default: 'RAWR' }),
  name: Schema.string({ optional: true }), // or required: false,
  home: Schema.string({ optional: true, default: 'Earth' })
}

class Dinosaur extends ActiveClass(dinosaurSchema) {}

const dinosaur = new Dinosaur({ species: 'Diplodocus' })
dinosaur.species // => 'Diplodocus'
dinosaur.roar // => 'RAWR'
dinosaur.name // => undefined
dinosaur.home // => 'Earth'

/* species: required and no default */
dinosaur.species = undefined // ActiveClassError: Dinosaur could not accept the value undefined (undefined) at path 'species'. The required property 'species' is missing
dinosaur.species = null // ActiveClassError: Dinosaur could not accept the value null (object) at path 'species'. The property 'species' is of the wrong type

/* roar: required and has default */
dinosaur.roar = undefined
dinosaur.roar // => 'RAWR' (default kicks in when undefined)
dinosaur.roar = null // ActiveClassError: Dinosaur could not accept the value null (object) at path 'roar'. The property 'roar' is of the wrong type

/* name: optional and has no default */
dinosaur.name = undefined
dinosaur.name // => undefined (optional, so doesn't throw, and has no default to kick in)
dinosaur.name = null
dinosaur.name // => null (optional, so doesn't throw and can be null)

/* home: optional and has default */
dinosaur.home = undefined
dinosaur.home // => 'Earth' (default kicks in when undefined)
dinosaur.home = null
dinosaur.home // => null (optional, so doesn't throw and can be null)
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
  roar: Schema.string({ default: 1 }),
  name: Schema.string({ optional: true }), // or required: false,
  home: Schema.string({ optional: true, default: 2 })
}

class Dinosaur extends ActiveClass(dinosaurSchema) {}

const dinosaur = new Dinosaur({ species: 'Diplodocus' })
dinosaur.species // => 'Diplodocus'
dinosaur.roar // => 'RAWR'
dinosaur.name // => undefined
dinosaur.home // => 'Earth'

/* species: required and no default */
dinosaur.species = undefined // (ts 2322) Type 'undefined' is not assignable to type 'string'
dinosaur.species = null // (ts 2322) Type 'null' is not assignable to type 'string'

/* roar: required and has default */
dinosaur.roar = undefined // (ts 2322) Type 'undefined' is not assignable to type 'string'
dinosaur.roar = null // (ts 2322) Type 'null' is not assignable to type 'string'

/* name: optional and has no default */
dinosaur.name = undefined // compiles
dinosaur.name = null // compiles

/* home: optional and has default */
dinosaur.home = undefined // (ts 2322) Type 'undefined' is not assignable to type 'string | null'
dinosaur.home = null // compiles
```

</TabItem>
</Tabs>