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

1. An author schema, holding first name and last name; and
2. A book schema, holding a title and author id.

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

class Author extends ActiveClass(authorSchema) {}

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

class Author extends ActiveClass(authorSchema) {}

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
   */
  author = relations.findById<Book>(Author, 'authorId')
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
animalFarmAuthor.secodnName = // => 'Orwell'
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
  authorId: orwell._id as string // or orwell.getId()
})

// we defined author as a LazyHasOne relation,
//  so executing it returns a promise
const animalFarmAuthor = await animalFarm.author()

animalFarmAuthor.firstName // => 'George'
animalFarmAuthor.secodnName = // => 'Orwell'
```

</TabItem>
</JsTsTabs>


## One-to-many (indexing)

## Avoiding circular imports
