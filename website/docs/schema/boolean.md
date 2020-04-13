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
    { label: 'JavaScript (runtime errors)', value: 'js', },
    { label: 'TypeScript (static / compilation errors)', value: 'ts', }
  ]}
>
<TabItem value='js'>

```js title='runtime errors'
import { ActiveClass, Schema } from 'fireactive'

const lightbulbSchema = {
  isOn: Schema.boolean
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

new Lightbulb() // (ts 2554) Expected 1 arguments, but got 0
new Lightbulb({}) // (ts 2354) Property 'isOn' is missing in type '{}' but required in... [assuming strictNullChecks]
new Lightbulb({ isOn: 'yes' }) // (ts 2322) Type 'string' is not assignable to type 'boolean'
new Lightbulb({ isOn: null }) // (ts 2322) Type 'null' is not assignable to type 'boolean' [assuming strictNullChecks]

new Lightbulb({ isOn: true }) // works
new Lightbulb({ isOn: false }) // works
```

</TabItem>
</Tabs>