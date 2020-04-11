---
id: structuring-relations
title: Structuring Relations
sidebar_label: Structuring Relations
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

## Flatten data in your database

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

## Inbuilt relation helpers

To make this easier, Fireactive provides *relations* to:
- encourage best practices in normalized data; and
- make it easier to fetch related data.

There are relation helpers for both [one-to-one](one-to-one-101.md) and [one-to-many](one-to-many-101.md) relationships.