---
id: overview
title: Overview
sidebar_label: Overview
---

## Why?

The [Firebase Realtime Database](https://firebase.google.com/docs/database) is great because it:

- syncs data between devices in realtime, no HTTP requests needed;
- can be used directly in client-side code, no backend server needed; and
- enables offline persistence in the absence of a connection.

But there are some pain points when using it with the [JavaScript SDK](https://firebase.google.com/docs/reference/js):

1. It can be cumbersome and repetitive to read data and set up listeners to sync data;
2. It is easy to forget precisely how you have [structured your NoSQL database](https://firebase.google.com/docs/database/web/structure-data) when writing your code; and
3. There is no autocomplete or type-checking on data read from the database.

## How?

Fireactive was built with three goals in mind:

1. Easy APIs for data syncing, on by default, to and from your Realtime Database;
2. Predictable data with an explicit model-based structure for objects and your database; and
3. Code autocomplete and type-checking with VS Code and/or TypeScript.

## What?

Fireactive is a strongly-typed Object Document Mapper with realtime syncing enabled by default for all data that is created, read or updated in your Firebase Realtime Database.

This is achieved through *Schema*-based *ActiveClass*es.

