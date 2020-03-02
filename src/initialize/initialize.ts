import firebase from 'firebase/app'
import { FirebaseConfig } from "../types/firebase.types"

let app: firebase.app.App
let realtimeDatabase: firebase.database.Database

export default function initialize(config: FirebaseConfig) {
  app = firebase.initializeApp(config)
  realtimeDatabase = app.database()
}

export const getFirebaseApp = () => app
export const getFirebaseDatabase = () => realtimeDatabase
