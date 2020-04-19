---
id: enum
title: Enum fields
sidebar_label: enum
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `Schema.enum`

## Basic example
Let's suppose we're modelling a coffee order, which can either be an Americano, Latte or Cappucino.

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

const coffeeOrderSchema = {
  type: Schema.enum(['Americano', 'Latte', 'Cappucino'])
}

class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

new CoffeeOrder() // ActiveClassError: Could not construct CoffeeOrder. The required property 'type' is missing
new CoffeeOrder({}) // ActiveClassError: Could not construct CoffeeOrder. The required property 'type' is missing
new CoffeeOrder({ type: 'Herbal' }) // ActiveClassError: Could not construct CoffeeOrder. The property 'type' is of the wrong type
new CoffeeOrder({ type: null }) // ActiveClassError: Could not construct CoffeeOrder. The property 'type' is of the wrong type

new CoffeeOrder({ type: 'Americano', randomProp: 'Latte' }) // works (but randomProp gets ignored as it is not on the schema)

new CoffeeOrder({ type: 'Americano' }) // works
new CoffeeOrder({ type: 'Latte' }) // works
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const coffeeOrderSchema = {
  type: Schema.enum
}

class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

// Key: * assumes strict null checks

new CoffeeOrder() // (ts 2554) Expected 1 arguments, but got 0
new CoffeeOrder({}) // (ts 2354)* Property 'type' is missing in type '{}' but required in...
new CoffeeOrder({ type: 'yes' }) // (ts 2322) Type 'string' is not assignable to type 'enum'
new CoffeeOrder({ type: null }) // (ts 2322)* Type 'null' is not assignable to type 'enum'
new CoffeeOrder({ type: true, randomProp: true }) // (ts 2345) Object literal may only specify known properties, and 'randomProp' does not exist in type...

new CoffeeOrder({ type: true }) // compiles
new CoffeeOrder({ type: false }) // compiles
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

const coffeeOrderSchema = {
  type: Schema.enum
}

class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

const coffeeOrder = new CoffeeOrder({ type: true })
coffeeOrder.type = false // works
coffeeOrder.type = 'true' // ActiveClassError: CoffeeOrder could not accept the value "true" (string) at path 'type'. The property 'type' is of the wrong type
coffeeOrder.type = undefined // ActiveClassError: CoffeeOrder could not accept the value undefined (undefined) at path 'type'. The required property 'type' is missing
coffeeOrder.type = null // ActiveClassError: CoffeeOrder could not accept the value null (object) at path 'type'. The property 'type' is of the wrong type
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const coffeeOrderSchema = {
  type: Schema.enum
}

class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

const coffeeOrder = new CoffeeOrder({ type: true })
coffeeOrder.type = false // compiles
coffeeOrder.type = 'true' // (ts 2322) Type '"true"' is not assignable to type 'enum'
coffeeOrder.type = undefined // (ts 2322) Type 'undefined' is not assignable to type 'enum'
coffeeOrder.type = null // (ts 2322) Type 'null' is not assignable to type 'enum'
```

</TabItem>
</Tabs>

## Configuration
A schema property can have a *default* value, **and/or** be *optional*.

In either case, if the property has a default value and/or is optional, it does not need to be supplied when the ActiveRecord is created.

Default values are used when a field's value would otherwise be `undefined`.

Only optional properties can be assigned `null` (i.e. the deliberate ommission of a value).

Let's add some additionl properties to our coffeeOrder schema to demonstrate:
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

const coffeeOrderSchema = {
  type: Schema.enum,
  isEco: Schema.enum({ default: false }),
  isLED: Schema.enum({ optional: true }), // or required: false,
  isSmart: Schema.enum({ optional: true, default: false })
}

class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

const coffeeOrder = new CoffeeOrder({ type: false })
coffeeOrder.type // => false
coffeeOrder.isEco // => false
coffeeOrder.isLED // => undefined
coffeeOrder.isSmart // => false

/* type: required and no default */
coffeeOrder.type = undefined // ActiveClassError: CoffeeOrder could not accept the value undefined (undefined) at path 'type'. The required property 'type' is missing
coffeeOrder.type = null // ActiveClassError: CoffeeOrder could not accept the value null (object) at path 'type'. The property 'type' is of the wrong type

/* isEco: required and has default */
coffeeOrder.isEco = undefined
coffeeOrder.isEco // => false (default kicks in when undefined)
coffeeOrder.isEco = null // ActiveClassError: CoffeeOrder could not accept the value null (object) at path 'isEco'. The property 'isEco' is of the wrong type

/* isLED: optional and has no default */
coffeeOrder.isLED = undefined
coffeeOrder.isLED // => undefined (optional, so doesn't throw, and has no default to kick in)
coffeeOrder.isLED = null
coffeeOrder.isLED // => null (optional, so doesn't throw and can be null)

/* isSmart: optional and has default */
coffeeOrder.isSmart = undefined
coffeeOrder.isSmart // => false (default kicks in when undefined)
coffeeOrder.isSmart = null
coffeeOrder.isSmart // => null (optional, so doesn't throw and can be null)
```

</TabItem>
<TabItem value='ts'>

| Assignment when | `default` defined | no `default` defined |
|---|---|---|
| **`required: true`** (default) <br/> or **`optional: false`** | `null`: non-assignable <br/> `undefined`: non-assignable | `null`: non-assignable <br/> `undefined`: non-assignable |
| **`optional: true`** <br/> or **`required: false`** | `null`: assignable <br/> `undefined`: non-assignable | `null`: assignable <br /> `undefined`: assignable |

```ts
import { ActiveClass, Schema } from 'fireactive'

const coffeeOrderSchema = {
  type: Schema.enum,
  isEco: Schema.enum({ default: false }),
  isLED: Schema.enum({ optional: true }), // or required: false,
  isSmart: Schema.enum({ optional: true, default: false })
}

class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

const coffeeOrder = new CoffeeOrder({ type: false })
coffeeOrder.type // => false
coffeeOrder.isEco // => false
coffeeOrder.isLED // => undefined
coffeeOrder.isSmart // => false

/* type: required and no default */
coffeeOrder.type = undefined // (ts 2322) Type 'undefined' is not assignable to type 'enum'
coffeeOrder.type = null // (ts 2322) Type 'null' is not assignable to type 'enum'

/* isEco: required and has default */
coffeeOrder.isEco = undefined // (ts 2322) Type 'undefined' is not assignable to type 'enum'
coffeeOrder.isEco = null // (ts 2322) Type 'null' is not assignable to type 'enum'

/* isLED: optional and has no default */
coffeeOrder.isLED = undefined // compiles
coffeeOrder.isLED = null // compiles

/* isSmart: optional and has default */
coffeeOrder.isSmart = undefined // (ts 2322) Type 'undefined' is not assignable to type 'enum | null'
coffeeOrder.isSmart = null // compiles
```

</TabItem>
</Tabs>