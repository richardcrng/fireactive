---
id: boolean
title: Boolean fields
sidebar_label: boolean
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `Schema.boolean`

## Basic example
Let's suppose we're modelling a lightbulb, which can either be on or off.

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

const lightbulbSchema = {
  isOn: Schema.boolean
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

new Lightbulb() // ActiveClassError: Could not construct Lightbulb. The required property 'isOn' is missing
new Lightbulb({}) // ActiveClassError: Could not construct Lightbulb. The required property 'isOn' is missing
new Lightbulb({ isOn: 'yes' }) // ActiveClassError: Could not construct Lightbulb. The property 'isOn' is of the wrong type
new Lightbulb({ isOn: null }) // ActiveClassError: Could not construct Lightbulb. The property 'isOn' is of the wrong type

new Lightbulb({ isOn: true, randomProp: true }) // works (but randomProp gets ignored as it is not on the schema)

new Lightbulb({ isOn: true }) // works
new Lightbulb({ isOn: false }) // works
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const lightbulbSchema = {
  isOn: Schema.boolean
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

// Key: * assumes strict null checks

new Lightbulb() // (ts 2554) Expected 1 arguments, but got 0
new Lightbulb({}) // (ts 2354)* Property 'isOn' is missing in type '{}' but required in...
new Lightbulb({ isOn: 'yes' }) // (ts 2322) Type 'string' is not assignable to type 'boolean'
new Lightbulb({ isOn: null }) // (ts 2322)* Type 'null' is not assignable to type 'boolean'
new Lightbulb({ isOn: true, randomProp: true }) // (ts 2345) Object literal may only specify known properties, and 'randomProp' does not exist in type...

new Lightbulb({ isOn: true }) // compiles
new Lightbulb({ isOn: false }) // compiles
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

const lightbulbSchema = {
  isOn: Schema.boolean
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

const lightbulb = new Lightbulb({ isOn: true })
lightbulb.isOn = false // works
lightbulb.isOn = 'true' // ActiveClassError: Lightbulb could not accept the value "true" (string) at path 'isOn'. The property 'isOn' is of the wrong type
lightbulb.isOn = undefined // ActiveClassError: Lightbulb could not accept the value undefined (undefined) at path 'isOn'. The required property 'isOn' is missing
lightbulb.isOn = null // ActiveClassError: Lightbulb could not accept the value null (object) at path 'isOn'. The property 'isOn' is of the wrong type
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const lightbulbSchema = {
  isOn: Schema.boolean
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

const lightbulb = new Lightbulb({ isOn: true })
lightbulb.isOn = false // compiles
lightbulb.isOn = 'true' // (ts 2322) Type '"true"' is not assignable to type 'boolean'
lightbulb.isOn = undefined // (ts 2322) Type 'undefined' is not assignable to type 'boolean'
lightbulb.isOn = null // (ts 2322) Type 'null' is not assignable to type 'boolean'
```

</TabItem>
</Tabs>

## Configuration
A schema property can have a *default* value, **and/or** be *optional*.

In either case, if the property has a default value and/or is optional, it does not need to be supplied when the ActiveRecord is created.

Default values are used when a field's value would otherwise be `undefined`.

Only optional properties can be assigned `null` (i.e. the deliberate ommission of a value).

Let's add some additionl properties to our lightbulb schema to demonstrate:
* `isEco` should default to `false`;
* `isLED`, should be an optional property;
* `isSmart`, should default to `false` *and* be an optional property.

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

const lightbulbSchema = {
  isOn: Schema.boolean,
  isEco: Schema.boolean({ default: false }),
  isLED: Schema.boolean({ optional: true }), // or required: false,
  isSmart: Schema.boolean({ optional: true, default: false })
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

const lightbulb = new Lightbulb({ isOn: false })
lightbulb.isOn // => false
lightbulb.isEco // => false
lightbulb.isLED // => undefined
lightbulb.isSmart // => false

/* isOn: required and no default */
lightbulb.isOn = undefined // ActiveClassError: Lightbulb could not accept the value undefined (undefined) at path 'isOn'. The required property 'isOn' is missing
lightbulb.isOn = null // ActiveClassError: Lightbulb could not accept the value null (object) at path 'isOn'. The property 'isOn' is of the wrong type

/* isEco: required and has default */
lightbulb.isEco = undefined
lightbulb.isEco // => false (default kicks in when undefined)
lightbulb.isEco = null // ActiveClassError: Lightbulb could not accept the value null (object) at path 'isEco'. The property 'isEco' is of the wrong type

/* isLED: optional and has no default */
lightbulb.isLED = undefined
lightbulb.isLED // => undefined (optional, so doesn't throw, and has no default to kick in)
lightbulb.isLED = null
lightbulb.isLED // => null (optional, so doesn't throw and can be null)

/* isSmart: optional and has default */
lightbulb.isSmart = undefined
lightbulb.isSmart // => false (default kicks in when undefined)
lightbulb.isSmart = null
lightbulb.isSmart // => null (optional, so doesn't throw and can be null)
```

</TabItem>
<TabItem value='ts'>

| Assignment when | `default` defined | no `default` defined |
|---|---|---|
| **`required: true`** (default) <br/> or **`optional: false`** | `null`: non-assignable <br/> `undefined`: non-assignable | `null`: non-assignable <br/> `undefined`: non-assignable |
| **`optional: true`** <br/> or **`required: false`** | `null`: assignable <br/> `undefined`: non-assignable | `null`: assignable <br /> `undefined`: assignable |

```ts
import { ActiveClass, Schema } from 'fireactive'

const lightbulbSchema = {
  isOn: Schema.boolean,
  isEco: Schema.boolean({ default: false }),
  isLED: Schema.boolean({ optional: true }), // or required: false,
  isSmart: Schema.boolean({ optional: true, default: false })
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

const lightbulb = new Lightbulb({ isOn: false })
lightbulb.isOn // => false
lightbulb.isEco // => false
lightbulb.isLED // => undefined
lightbulb.isSmart // => false

/* isOn: required and no default */
lightbulb.isOn = undefined // (ts 2322) Type 'undefined' is not assignable to type 'boolean'
lightbulb.isOn = null // (ts 2322) Type 'null' is not assignable to type 'boolean'

/* isEco: required and has default */
lightbulb.isEco = undefined // (ts 2322) Type 'undefined' is not assignable to type 'boolean'
lightbulb.isEco = null // (ts 2322) Type 'null' is not assignable to type 'boolean'

/* isLED: optional and has no default */
lightbulb.isLED = undefined // compiles
lightbulb.isLED = null // compiles

/* isSmart: optional and has default */
lightbulb.isSmart = undefined // (ts 2322) Type 'undefined' is not assignable to type 'boolean | null'
lightbulb.isSmart = null // compiles
```

</TabItem>
</Tabs>