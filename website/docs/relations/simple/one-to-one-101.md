---
id: one-to-one
title: One-to-One (storing an id)
sidebar_label: One-to-One (storing an id)
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TabItem from '@theme/TabItem';
import JsTsTabs from '../../../src/lib/atoms/JsTsTabs';

Let's suppose we want to model a relationship between Authors and Books. For simplicity's sake, we'll assume a book only has a single Author.

We'll model this by creating a way for a given Book instance to easily fetch its related Author from the database via a known `_id`.

## Setup: Schemas and ActiveClasses

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

:::caution Beware circular imports
The above example uses relations defined between two classes in the same file.

It is important to be careful when defining relations between classes in multiple files, as you may inadvertently end up with some [circular imports](https://stackoverflow.com/questions/38841469/how-to-fix-this-es6-module-circular-dependency).

Fireactive provides a way to escape this through an alternative `relations` API, where you pass in a string as the first argument rather than a class (removing the need to import a class from one file into another).

This is documented in ['Circular Relations'](circular-relations.md).
:::

## Execution: awaiting a promise

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
 * Note that an ActiveDocument's _id has type of
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