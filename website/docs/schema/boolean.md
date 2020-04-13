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

<Tabs
  defaultValue="js"
  values={[
    { label: 'Run-time type checks (JS)', value: 'js', },
    { label: 'Static / compilation type checks (TS)', value: 'ts', }
  ]}
>
<TabItem value='js'>

```js title='runtime errors'
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

## Configuration
Let's add a couple of additional boolean properties:
* `isLED`, which should default to `false`; and
* `isSmart`, which is an optional property; and
* `hasColour`, which is an optional *and* defaults to false.

<Tabs
  defaultValue="js"
  values={[
    { label: 'Runtime type checks (JS)', value: 'js', },
    { label: 'Static / compile-time type checks (TS)', value: 'ts', }
  ]}
>
<TabItem value='js'>

```js title='runtime errors'
import { ActiveClass, Schema } from 'fireactive'

const lightbulbSchema = {
  isOn: Schema.boolean,
  isLED: Schema.boolean({ default: false }),
  isSmart: Schema.boolean({ optional: true }) // or required: false
  hasColour: Schema.boolean({ optional: true, default: false })
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

new Lightbulb() // Could not construct Lightbulb. The required property 'isOn' is missing
new Lightbulb({}) // Could not construct Lightbulb. The required property 'isOn' is missing
new Lightbulb({ isOn: 'yes' }) // Could not construct Lightbulb. The property 'isOn' is of the wrong type
new Lightbulb({ isOn: null }) // Could not construct Lightbulb. The property 'isOn' is of the wrong type

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

new Lightbulb({ isOn: true }) // works
new Lightbulb({ isOn: false }) // works
```

</TabItem>
</Tabs>