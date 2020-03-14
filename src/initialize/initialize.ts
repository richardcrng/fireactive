import firebase from 'firebase'
import { FirebaseConfig } from "../types/firebase.types"

let app: firebase.app.App
let realtimeDatabase: firebase.database.Database

export default function initialize(config: Partial<FirebaseConfig>) {
  app = firebase.initializeApp(config)
  realtimeDatabase = app.database()
  return app
}

export const getFirebaseApp = (): firebase.app.App => {
  if (!app) {
    throw new Error("Cannot find a Firebase app. Try calling fireactive.initialize to initialize your app. If that still doesn't work... 🤷")
  }
  return app
}
export const getFirebaseDatabase = (): firebase.database.Database => {
  try {
    if (!realtimeDatabase) {
      realtimeDatabase = getFirebaseApp().database()
    }
    return realtimeDatabase
  } catch (err) {
    throw new Error('Could not connect to your Firebase database. This might be because you have not initialized your Firebase app. Try calling fireactive.initialize')
  }
}
