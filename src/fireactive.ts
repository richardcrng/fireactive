import * as firebase from 'firebase'
import dotenv from 'dotenv'
import { FirebaseConfig } from './types/firebase.types'
import { TypedSchema } from './types/schema.types';
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

type Entity<T> = Schema<T> & {
  save(): void
}

const schema = {
  name: Schema.string,
  isHost: Schema.boolean,
  age: Schema.number({ optional: true })
}

type MyType = TypedSchema<typeof schema>

const myType: MyType = {
  name: 'hello',
  isHost: true
}

