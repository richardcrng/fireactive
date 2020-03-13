import firebase from 'firebase/app'
import 'firebase/database'
import { FirebaseConfig } from "../types/firebase.types"

let app: firebase.app.App
let realtimeDatabase: firebase.database.Database

export default function initialize(config: Partial<FirebaseConfig>) {
  app = firebase.initializeApp(config)
  realtimeDatabase = app.database()
  return app
}

export const getFirebaseApp = () => app
export const getFirebaseDatabase = () => realtimeDatabase
