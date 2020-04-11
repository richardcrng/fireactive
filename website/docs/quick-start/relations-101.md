---
id: relations-101
title: Modelling Relations
sidebar_label: Modelling Relations
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

## Why use relations?

### Flatten data in your database

The official Firebase docs on **['Best practices for data structure'](https://firebase.google.com/docs/database/web/structure-data#best_practices_for_data_structure)** explicitly advise *against* nested data.

Instead, Firebase recommends *'flattened'* (or 'denormalized') data structures.

<Tabs
  defaultValue="nested"
  values={[
    { label: 'Nested structure', value: 'nested', },
    { label: 'Flattened equivalent', value: 'flattened', }
  ]}
>

<TabItem value="nested">

This is based off the [nested data structure example](https://firebase.google.com/docs/database/web/structure-data#avoid_nesting_data) in the Firebase docs.

```js
{
  // This is a poorly nested data architecture, because iterating the children
  // of the "chats" node to get a list of conversation titles requires
  // potentially downloading hundreds of megabytes of messages
  "chats": {
    "one": {
      "title": "Historical Tech Pioneers",
      "messages": {
        "m1": { "sender": "ghopper", "message": "Relay malfunction found. Cause: moth." },
        "m2": { ... },
        // a very long list of messages
      }
    },
    "two": { ... }
  }
}
```

</TabItem>
<TabItem value="flattened">

This is based off the [flattened data structure example](https://firebase.google.com/docs/database/web/structure-data#flatten_data_structures) in the Firebase docs.

```js
{
  // Chats contains only meta info about each conversation
  // stored under the chats's unique ID
  "chats": {
    "one": {
      "title": "Historical Tech Pioneers",
      "lastMessage": "ghopper: Relay malfunction found. Cause: moth.",
      "timestamp": 1459361875666
    },
    "two": { ... },
    "three": { ... }
  },

  // Conversation members are easily accessible
  // and stored by chat conversation ID
  "members": {
    // indexing by key
    "one": {
      // the value here is just to ensure the key exists
      "ghopper": true,
      "alovelace": true,
      "eclarke": true
    },
    "two": { ... },
    "three": { ... }
  },

  // Messages are separate from data we may want to iterate quickly
  // but still easily paginated and queried, and organized by chat
  // conversation ID
  "messages": {
    "one": {
      "m1": {
        "name": "eclarke",
        "message": "The relay seems to be malfunctioning.",
        "timestamp": 1459361875337
      },
      "m2": { ... },
      "m3": { ... }
    },
    "two": { ... },
    "three": { ... }
  }
}
```

</TabItem>
</Tabs>

### Inbuilt relation helpers

To make this easier, Fireactive provides *relations* to:
- encourage best practices in normalized data; and
- make it easier to fetch related data.

## One-to-one (storing an id)

Let's suppose we want to model a relationship between Authors and Books. For simplicity's sake, we'll assume a book only has a single Author.

We'll model this by creating a way for a given Book instance to easily fetch its related Author from the database via a known `_id`.

### Setup: Schemas and ActiveClasses

We'll create two schemas:

1. An author schema, holding an author's first name and last name; and
2. A book schema, holding a book's title and the id of the author who wrote it.

<JsTsTabs>
<TabItem value="js">

```js
import { ActiveClass, Schema, relations } from 'fireactive'

const authorSchema = {
  firstName: Schema.string,
  lastName: Schema.string
}

const bookSchema = {
  title: Schema.string,
  authorId: Schema.string // this will reference an author
}

class Author extends ActiveClass(authorSchema) {
  /**
   * We can optionally add our own methods, e.g.
   *  maybe a getter / virtual property for 'name'
   */ 
  get name() {
    return `${this.firstName} ${this.lastName}`
  }
}

class Book extends ActiveClass(bookSchema) {
  /**
   * Have the `book.author` property be a `LazyHasOne`
   *  relation from `book` (instance of `Book`) to a
   *  specific instance of `Author`, via the `book.authorId`
   *  property (used on `Author.findById`).
   */
  author = relations.findById(Author, 'authorId')
}
```

</TabItem>
<TabItem value="ts">

```ts
import { ActiveClass, Schema, relations } from 'fireactive'

const authorSchema = {
  firstName: Schema.string,
  lastName: Schema.string
}

const bookSchema = {
  title: Schema.string,
  authorId: Schema.string // this will reference an author
}

class Author extends ActiveClass(authorSchema) {
  /**
   * We can optionally add our own methods, e.g.
   *  maybe a getter / virtual property for 'name'
   */ 
  get name(): string {
    return `${this.firstName} ${this.lastName}`
  }
}

class Book extends ActiveClass(bookSchema) {
  /**
   * Have the `book.author` property be a `LazyHasOne`
   *  relation from `book` (instance of `Book`) to a
   *  specific instance of `Author`, via the `book.authorId`
   *  property (used on `Author.findById`).
   * 
   * The first type parameter is used to constrain the prop
   *  provided - e.g. 'author_id' will throw a static error,
   *  since there is no key of 'author_id' on a Book instance.
   * 
   * The second type parameter tells TypeScript what type
   *  the promise will resolve with. (It's not always the type
   *  of the first argument - the API also supports passing in
   *  the string 'Author' instead of the whole classs)
   */
  author = relations.findById<Book, Author>(Author, 'authorId')
}
```

</TabItem>
</JsTsTabs>

### Execution: awaiting a promise

Relations are lazy by default, which means they only load the related data when explicitly required to. 

<JsTsTabs>
<TabItem value="js">

```js
import { initialize } from 'fireactive'
import { Author, Book } from '../path/to/models' // or wherever

// initialize with your own database url
//  to use an ActiveClass's `.create` 
initialize({ databaseURL: process.env.DATABASE_URL })

// Author.create resolves when database has been written to
const orwell = await Author.create({
  firstName: 'George',
  lastName: 'Orwell'
})

const animalFarm = await Book.create({
  title: 'Animal Farm: A Fairy Story',
  authorId: orwell._id
})

// we defined author as a LazyHasOne relation,
//  so executing it returns a promise
const animalFarmAuthor = await animalFarm.author()

animalFarmAuthor.firstName // => 'George'
animalFarmAuthor.secondName = // => 'Orwell'
animalFarmAuthor.name // => 'George Orwell'
```

</TabItem>
<TabItem value="ts">

```ts
import { initialize } from 'fireactive'
import { Author, Book } from '../path/to/models' // or wherever

// initialize with your own database url
//  to use an ActiveClass's `.create` 
initialize({ databaseURL: process.env.DATABASE_URL })

// Author.create resolves when database has been written to
const orwell = await Author.create({
  firstName: 'George',
  lastName: 'Orwell'
})


/**
 * Note that an ActiveRecord's _id has type of
 *  string | undefined, because it is sometimes
 *  undefined (e.g. if you use the `new` operator
 *  and haven't yet saved it to the database).
 * 
 * However, according to our bookSchema, a book *must*
 *  have an `authorId`, which needs to be a string.
 * 
 * You can either cast the _id property to a string,
 *  or alternatively use .getId() which returns a
 *  string (or else throws a runtime error).
 */ 
const animalFarm = await Book.create({
  title: 'Animal Farm: A Fairy Story',
  authorId: orwell._id as string // better: orwell.getId()
})

// we defined author as a LazyHasOne relation,
//  so executing it returns a promise
const animalFarmAuthor = await animalFarm.author()


/**
 * If you have strictNullChecks enabled, TS will
 *  warn that `animalFarmAuthor` is possibly null
 *  (since we can't guarantee in general at runtime
 *  that a book's `authorId` property exists amongst
 *  the database's Authors).
 * 
 * Using the findByIdOrFail relation will ensure
 *  that the return value is an Author
 */ 
if (animalFarmAuthor) {
  animalFarmAuthor.firstName // => 'George'
  animalFarmAuthor.secondName // => 'Orwell'
  animalFarmAuthor.name // => 'George Orwell'
}
```

</TabItem>
</JsTsTabs>


## One-to-many (indexing)

Let's build on our previous one-to-one example by introducing Series (representing a book series). A single Series can have many books, and might have multiple authors (e.g. the 'For Dummies' series has multiple different authors depending on the topic).

### Setup: Schemas and ActiveClasses

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

### Execution: awaiting a promise

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

## Avoiding circular imports
