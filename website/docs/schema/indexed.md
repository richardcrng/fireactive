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

## Creation
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

## Assignment
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

dictionary.booleanVals.someProp = 'false' // (ts 2332) Type '"false"' is not assignable to type 'boolean'
dictionary.booleanVals.someProp = false // compiles

dictionary.fooOrBarVals.someProp = 'BAR' // (ts 2332) Type '"BAR"' is not assignable to type '"foo" | "bar"'
dictionary.fooOrBarVals.someProp = 'bar' // compiles

dictionary.numberVals.someProp = '5' // (ts 2332) Type '"5"' is not assignable to type 'number'
dictionary.numberVals.someProp = 5 // compiles

dictionary.stringVals.someProp = 5 // (ts 2332) Type '5' is not assignable to type 'string'
dictionary.stringVals.someProp = '5' // compiles

dictionary.trueVals.someProp = false // (ts 2332) Type 'false' is not assignable to type 'true'
dictionary.trueVals.someProp = true // compiles
```

</TabItem>
</Tabs>