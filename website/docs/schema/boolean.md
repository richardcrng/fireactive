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

new Lightbulb({ isOn: true }) // works
new Lightbulb({ isOn: false }) // works
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
lightbulb.isOn = false // works
lightbulb.isOn = 'true' // (ts 2322) Type '"true"' is not assignable to type 'boolean'
```

</TabItem>
</Tabs>

## Configuration
A schema property can have a *default* value, **and/or** be *optional*.

In either case, if the property has a default value and/or is optional, it does not need to be supplied when the ActiveRecord is created.

Default values are used when a field's value would otherwise be `undefined`.

Only optional properties can be assigned `null` (i.e. the deliberate ommission of a value).

| | has a default value | does not have a default value |
|---|---|---|
| **is optional** | holds `null`, defaults on `undefined` | holds both `null` and `undefined` |
| **is required** | throws on `null`, defaults on `undefined` | throws on `null`, throws on `undefined` |

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

```js
import { ActiveClass, Schema } from 'fireactive'

const lightbulbSchema = {
  isOn: Schema.boolean,
  isEco: Schema.boolean({ default: false }),
  isLED: Schema.boolean({ optional: true }), // or required: false,
  isSmart: Schema.boolean({ optional: true, default: false })
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

const bulbOne = new Lightbulb({ isOn: false })
bulbOne.isOn // => false
bulbOne.isEco // => false
bulbOne.isLED // => undefined
bulbOne.isSmart // => false

/* isOn: required and no default */
bulbOne.isOn = undefined // ActiveClassError: Lightbulb could not accept the value undefined (undefined) at path 'isOn'. The required property 'isOn' is missing
bulbOne.isOn = null // ActiveClassError: Lightbulb could not accept the value null (object) at path 'isOn'. The property 'isOn' is of the wrong type

/* isEco: required and has default */
bulbOne.isEco = undefined
bulbOne.isEco // => false (default kicks in when undefined)
bulbOne.isEco = null // ActiveClassError: Lightbulb could not accept the value null (object) at path 'isEco'. The property 'isEco' is of the wrong type

/* isLED: optional and has no default */
bulbOne.isLED = undefined
bulbOne.isLED // => undefined (optional, so doesn't throw, and has no default to kick in)
bulbOne.isLED = null
bulbOne.isLED // => null (optional, so doesn't throw and can be null)

/* isSmart: optional and has default */
bulbOne.isSmart = undefined
bulbOne.isSmart // => false (default kicks in when undefined)
bulbOne.isSmart = null
bulbOne.isSmart // => null (optional, so doesn't throw and can be null)
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

new Lightbulb({ isOn: true }) // works
new Lightbulb({ isOn: false }) // works
```

</TabItem>
</Tabs>