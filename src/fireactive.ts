import * as firebase from 'firebase'
import dotenv from 'dotenv'
import { FirebaseConfig } from './types/firebase.types'
import { RecordObject } from './types/schema.types';
import Schema from './Schema';

dotenv.config()

const config: FirebaseConfig = {
  apiKey: process.env.API_KEY as string,
  authDomain: process.env.AUTH_DOMAIN as string,
  databaseURL: process.env.DATABASE_URL as string,
  projectId: process.env.PROJECT_ID as string,
  storageBucket: process.env.STORAGE_BUCKET as string,
  messagingSenderId: process.env.MESSAGING_SENDER_ID as string
}

const app = firebase.initializeApp(config)
const db = firebase.database()

type Record<T> = RecordObject<T> & {
  save(): Promise<void>,
  toObject(): RecordObject<T>
}

const schema = {
  name: Schema.string,
  isHost: Schema.boolean,
  age: Schema.number({ optional: true })
}

export function createORM<Schema>(tableName: string, schema: Schema) {

  // our JavaScript `Record` variable, with a constructor type
  let Record: {
    new(props: RecordObject<Schema>): Record<Schema>;
    prototype: Record<Schema>;

    // static class properties and methods are actually part
    // of the constructor type!
    create(props: RecordObject<Schema>): Promise<Record<Schema>>;
  };

  // `Function` does not fulfill the defined type so
  // it needs to be cast to <any>
  Record = <any>function (this: Record<Schema>, props: Schema): void {
    // ...
  };

  // static properties/methods go on the JavaScript variable...
  Record.create = async function (props: RecordObject<Schema>): Promise<Record<Schema>> {
    const ref = await db.ref(tableName).push()
    const _id = ref.key as string
    const record = new Record({ ...props, _id })
    await db.ref(tableName).child(_id).set({ ...props, _id })
    return record
  };

  // instance properties/methods go on the prototype
  Record.prototype.save = async function (): Promise<void> {
    if (this._id) {
      await db.ref(tableName).child(this._id).set(this.toObject())
    }
  };

  Record.prototype.toObject = function(): RecordObject<Schema> {
    return [...Object.keys(schema), "_id"].reduce((acc, key) => {
      // @ts-ignore
      acc[key] = this[key]
      return acc
    }, {}) as RecordObject<Schema>
  }

  return Record
}
