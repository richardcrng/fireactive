import dotenv from 'dotenv'
import { FirebaseConfig } from './types/firebase.types'
import baseClass from './baseClass'
import initialize from './initialize';
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

const Fireactive = {
  initialize,
  baseClass,
  Schema
}

export {
  initialize,
  baseClass,
  Schema
}

export default Fireactive