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
new CoffeeOrder({ type: 'Herbal' }) // (ts 2322) Type '"Herbal"' is not assignable to type '"Americano" | "Latte" | "Capuccino"'
new CoffeeOrder({ type: null }) // (ts 2322)* Type 'null' is not assignable to type '"Americano" | "Latte" | "Capuccino"'
new CoffeeOrder({ type: 'Americano', randomProp: 'Latte' }) // (ts 2345) Object literal may only specify known properties, and 'randomProp' does not exist in type...

new CoffeeOrder({ type: 'Americano' }) // compiles
new CoffeeOrder({ type: 'Latte' }) // compiles
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
  type: Schema.enum(['Americano', 'Latte', 'Cappucino'])
}

class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

const coffeeOrder = new CoffeeOrder({ type: 'Americano' })
coffeeOrder.type = 'Latte' // works
coffeeOrder.type = 'Orange juice' // ActiveClassError: CoffeeOrder could not accept the value "Orange juice" (string) at path 'type'. The property 'type' is of the wrong type
coffeeOrder.type = undefined // ActiveClassError: CoffeeOrder could not accept the value undefined (undefined) at path 'type'. The required property 'type' is missing
coffeeOrder.type = null // ActiveClassError: CoffeeOrder could not accept the value null (object) at path 'type'. The property 'type' is of the wrong type
```

</TabItem>
<TabItem value='ts'>

```ts
import { ActiveClass, Schema } from 'fireactive'

const coffeeOrderSchema = {
  type: Schema.enum(['Americano', 'Latte', 'Cappucino'])
}

class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

const coffeeOrder = new CoffeeOrder({ type: 'Americano' })
coffeeOrder.type = 'Latte' // compiles
coffeeOrder.type = 'Orange juice' // (ts 2322) Type '"Orange juice"' is not assignable to type '"Americano" | "Latte" | "Capuccino"'
coffeeOrder.type = undefined // (ts 2322) Type 'undefined' is not assignable to type '"Americano" | "Latte" | "Capuccino"'
coffeeOrder.type = null // (ts 2322) Type 'null' is not assignable to type '"Americano" | "Latte" | "Capuccino"'
```

</TabItem>
</Tabs>

## Configuration
A schema property can have a *default* value, **and/or** be *optional*.

In either case, if the property has a default value and/or is optional, it does not need to be supplied when the ActiveRecord is created.

Default values are used when a field's value would otherwise be `undefined`.

Only optional properties can be assigned `null` (i.e. the deliberate ommission of a value).

Let's add some additionl properties to our coffeeOrder schema to demonstrate:
* `size` should default to `'regular'` but also accept `'small'` and `'large'`;
* `chain`, should be an optional property, but, if given, must be `'Starbucks'`, `'Costa'` or `'Pret'`;
* `milk`, should default to `'dairy'` *and* be an optional property which, if given, must be `'dairy'`, `'oat'` or `'soya'`.

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
  type: Schema.enum(['Americano', 'Latte', 'Cappucino']),
  size: Schema.enum(['small', 'regular', 'large'], { default: 'regular' }),
  chain: Schema.enum(['Starbucks', 'Costa', 'Pret'], { optional: true }), // or required: false,
  milk: Schema.enum(['dairy', 'oat', 'soya'], { optional: true, default: 'dairy' })
}

class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

const coffeeOrder = new CoffeeOrder({ type: false })
coffeeOrder.type // => 'Americano'
coffeeOrder.size // => 'regular'
coffeeOrder.chain // => undefined
coffeeOrder.milk // => 'dairy'

/* type: required and no default */
coffeeOrder.type = undefined // ActiveClassError: CoffeeOrder could not accept the value undefined (undefined) at path 'type'. The required property 'type' is missing
coffeeOrder.type = null // ActiveClassError: CoffeeOrder could not accept the value null (object) at path 'type'. The property 'type' is of the wrong type

/* size: required and has default */
coffeeOrder.size = undefined
coffeeOrder.size // => 'regular' (default kicks in when undefined)
coffeeOrder.size = null // ActiveClassError: CoffeeOrder could not accept the value null (object) at path 'size'. The property 'size' is of the wrong type

/* chain: optional and has no default */
coffeeOrder.chain = undefined
coffeeOrder.chain // => undefined (optional, so doesn't throw, and has no default to kick in)
coffeeOrder.chain = null
coffeeOrder.chain // => null (optional, so doesn't throw and can be null)

/* milk: optional and has default */
coffeeOrder.milk = undefined
coffeeOrder.milk // => 'dairy' (default kicks in when undefined)
coffeeOrder.milk = null
coffeeOrder.milk // => null (optional, so doesn't throw and can be null)
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
  type: Schema.enum(['Americano', 'Latte', 'Cappucino']),
  size: Schema.enum(['small', 'regular', 'large'], { default: 'regular' }),
  chain: Schema.enum(['Starbucks', 'Costa', 'Pret'], { optional: true }), // or required: false,
  milk: Schema.enum(['dairy', 'oat', 'soya'], { optional: true, default: 'dairy' })
}

class CoffeeOrder extends ActiveClass(coffeeOrderSchema) {}

const coffeeOrder = new CoffeeOrder({ type: 'Americano' })
coffeeOrder.type // => 'Americano'
coffeeOrder.size // => 'regular'
coffeeOrder.chain // => undefined
coffeeOrder.milk // => 'dairy'

/* type: required and no default */
coffeeOrder.type = undefined // (ts 2322) Type 'undefined' is not assignable to type '"Americano" | "Latte" | "Capuccino"'
coffeeOrder.type = null // (ts 2322) Type 'null' is not assignable to type '"Americano" | "Latte" | "Capuccino"'

/* size: required and has default */
coffeeOrder.size = undefined // (ts 2322) Type 'undefined' is not assignable to type '"Americano" | "Latte" | "Capuccino"'
coffeeOrder.size = null // (ts 2322) Type 'null' is not assignable to type '"Americano" | "Latte" | "Capuccino"'

/* chain: optional and has no default */
coffeeOrder.chain = undefined // compiles
coffeeOrder.chain = null // compiles

/* milk: optional and has default */
coffeeOrder.milk = undefined // (ts 2322) Type 'undefined' is not assignable to type 'enum | null'
coffeeOrder.milk = null // compiles
```

</TabItem>
</Tabs>