---
id: one-to-many
title: One-to-Many (indexing keys)
sidebar_label: One-to-Many (indexing keys)
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export const JsTsTabs = ({ children }) => (
  <Tabs
    defaultValue="js"
    values={[
      { label: 'JavaScript', value: 'js', },
      { label: 'TypeScript', value: 'ts', }
    ]}
  >
    {children}
  </Tabs>
)

Let's build on [our previous one-to-one example](one-to-one-101.md) by introducing Series (representing a book series). A single Series can have many books, and might have multiple authors (e.g. the 'For Dummies' series has multiple different authors depending on the topic).

## Setup: Schemas and ActiveClasses

We'll add one schema for a Series.

A series should have a series name, as well as information about the books that it contains.

Following the Firebase recommendations, we'll be storing data (in a flattened form using indexes)[#flatten-data-in-your-database].

For example, rather than storing book ids as an array of strings (such as `['book01', 'book32', 'book77']`), we'll store the same information in an object where the values don't matter (so we'll just use `true` for simplicity): what matters is the presence of the keys, i.e. `{ book01: true, book32: true, book77: true }`.

This makes it more efficient to check whether a given string (or id) exists, since it can just check whether the key exists (instead of iterating through the array to check each value individually).

<JsTsTabs>
<TabItem value="js">

```js
import { ActiveClass, Schema, relations } from 'fireactive'

const seriesSchema = {
  name: Schema.string,
  bookIds: Schema.indexed.true // indexed with true as the values
}

class Series extends ActiveClass(seriesSchema) {
  /**
   * Have the `series.books` property be a `LazyHasMany`
   *  relation from `series` (instance of `Series`) to a
   *  specific instance of `Author`, via the keys of
   *  `series.bookIds`
   */
  books = relations.findByIds(Book, () => Object.keys(this.bookIds))
}
```

</TabItem>
<TabItem value="ts">

```ts
import { ActiveClass, Schema, relations } from 'fireactive'

const seriesSchema = {
  name: Schema.string,
  bookIds: Schema.indexed.true // indexed with true as the values
}

class Series extends ActiveClass(seriesSchema) {
  /**
   * Have the `series.books` property be a `LazyHasMany`
   *  relation from `series` (instance of `Series`) to a
   *  specific instance of `Author`, via the keys of
   *  `series.bookIds`
   */
  books = relations.findByIds<Series, Book>(Book, () => Object.keys(this.bookIds))
}
```

</TabItem>
</JsTsTabs>

## Execution: awaiting a promise

Relations are lazy by default, which means they only load the related data when explicitly required to. 

<JsTsTabs>
<TabItem value="js">

```js
import { initialize } from 'fireactive'
import { Author, Book, Series } from '../path/to/models' // or wherever

// initialize with your own database url
//  to use an ActiveClass's `.create` 
initialize({ databaseURL: process.env.DATABASE_URL })

// Author.create resolves when database has been written to
const adamFowler = await Author.create({
  firstName: 'Adam',
  lastName: 'Fowler'
})

const emilyVanderVeer = await Author.create({
  firstName: 'Emily',
  lastName: 'Vander Veer'
})

const noSqlForDummies = await Book.create({
  title: 'NoSQL For Dummies',
  authorId: adamFowler._id
})

const jsForDummies = await Book.create({
  title: 'JavaScript For Dummies',
  authorId: emilyVanderVeer._id
})

const dummiesSeries = await Series.create({
  name: 'For Dummies',
  bookIds: {
    [noSqlForDummies._id]: true,
    [jsForDummies._id]: true
  }
})

// we defined books as a LazyHasMany relation,
//  so executing it returns a promise
const dummiesBooks = await dummiesSeries.books()

dummiesBooks[0].title // => 'NoSQL For Dummies'
dummiesBooks[1].title // => 'JavaScript For Dummies'
```

</TabItem>
<TabItem value="ts">

```ts
import { initialize } from 'fireactive'
import { Author, Book, Series } from '../path/to/models' // or wherever

// initialize with your own database url
//  to use an ActiveClass's `.create` 
initialize({ databaseURL: process.env.DATABASE_URL })

// Author.create resolves when database has been written to
const adamFowler = await Author.create({
  firstName: 'Adam',
  lastName: 'Fowler'
})

const emilyVanderVeer = await Author.create({
  firstName: 'Emily',
  lastName: 'Vander Veer'
})

// we'll use .getId() which is typed as string
//  but you could cast ._id to string

const noSqlForDummies = await Book.create({
  title: 'NoSQL For Dummies',
  authorId: adamFowler.getId()
})

const jsForDummies = await Book.create({
  title: 'JavaScript For Dummies',
  authorId: emilyVanderVeer.getId()
})

const dummiesSeries = await Series.create({
  name: 'For Dummies',
  bookIds: {
    [noSqlForDummies.getId()]: true,
    [jsForDummies.getId()]: true
  }
})

// we defined books as a LazyHasMany relation,
//  so executing it returns a promise
const dummiesBooks = await dummiesSeries.books()

dummiesBooks[0].title // => 'NoSQL For Dummies'
dummiesBooks[1].title // => 'JavaScript For Dummies'
```

</TabItem>
</JsTsTabs>

