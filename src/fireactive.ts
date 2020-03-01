import * as firebase from 'firebase'
import dotenv from 'dotenv'
import { FirebaseConfig } from './types/firebase.types'
import { Schema, SchemaShorthand, SchemaLonghand } from './types/schema.types'

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

type Entity<Shorthand> = Schema<Shorthand> & {
  save(): void
}

export function schematise(schema: SchemaShorthand) {
  Object.entries(schema).forEach(([key, val]) => {
    schema[key] = [String, Number, Boolean].includes(val)
      ? { type: val }
      : schematise(val)
  })

  return schema
}

export function createORM(tableName: string, schema: SchemaShorthand) {

  const createNewEntity = (props: Schema<SchemaShorthand>): Entity<SchemaShorthand> => {
    return {
      ...props,
      save: () => console.log('saving')
    }
  }

  return {
    new: createNewEntity
  }
}
