import * as firebase from 'firebase'
import dotenv from 'dotenv'
import { FirebaseConfig } from './types/firebase.types'
import { ObjectFromRecord, ToCreateRecord, RecordSchema, ActiveRecord, RecordModel } from './types/record.types';

dotenv.config()

const config: FirebaseConfig = {
  apiKey: process.env.API_KEY as string,
  authDomain: process.env.AUTH_DOMAIN as string,
  databaseURL: process.env.DATABASE_URL as string,
  projectId: process.env.PROJECT_ID as string,
  storageBucket: process.env.STORAGE_BUCKET as string,
  messagingSenderId: process.env.MESSAGING_SENDER_ID as string
}

let app: firebase.app.App
let realtimeDatabase: firebase.database.Database
// let hasInitialised: boolean = false

export function initialize(config: FirebaseConfig) {
  app = firebase.initializeApp(config)
  realtimeDatabase = app.database()
  // hasInitialised = true
}

export function modelRecord<Schema extends RecordSchema>(tableName: string, schema: Schema) {
  // our JavaScript `Record` variable, with a constructor type
  let Record: RecordModel<Schema>;

  // `Function` does not fulfill the defined type so
  // it needs to be cast to <any>
  Record = <any>function (
    this: ActiveRecord<Schema>,
    props: ToCreateRecord<Schema> & { _id?: string }
  ): void {

    Object.keys(schema).forEach((schemaKey) => {
      // @ts-ignore : create it from props
      this[schemaKey] = props[schemaKey]
      // @ts-ignore : check if schema specifies default and if it's currently undefined
      if (schema[schemaKey]._hasDefault && typeof this[schemaKey] === 'undefined') {
        // @ts-ignore : use the schema's default
        this[schemaKey] = schema[schemaKey].default
      }
    })
  };

  // static properties/methods go on the JavaScript variable...
  Record.create = async function (
    props: ToCreateRecord<Schema> & { _id?: string }
  ): Promise<ActiveRecord<Schema>> {
    const db = this.getDb()

    let _id: string
    if (props._id) {
      _id = props._id
    } else {
      const ref = await db.ref(tableName).push()
      _id = ref.key as string
    }
    // @ts-ignore
    const record = new Record({ ...props, _id })
    await db.ref(tableName).child(_id).set({ ...props, _id })
    return record
  };

  Record.getDb = function() {
    if (!realtimeDatabase) {
      throw new Error('Cannot get Firebase Real-Time Database instance: have you intialised the Firebase connection?')
    }

    return realtimeDatabase
  }

  // instance methods and properties
  Record.prototype.save = async function (): Promise<void> {
    const db = this.constructor.getDb()
    if (this._id) {
      await db.ref(tableName).child(this._id).set(this.toObject())
    }
  };

  Record.prototype.toObject = function(): ObjectFromRecord<Schema> {
    return [...Object.keys(schema), "_id"].reduce((acc, key) => {
      // @ts-ignore
      acc[key] = this[key]
      return acc
    }, {}) as ObjectFromRecord<Schema>
  }

  return Record
}
