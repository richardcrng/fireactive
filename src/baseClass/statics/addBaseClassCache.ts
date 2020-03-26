import { whereEq } from 'ramda'
import { BaseClass, ActiveRecord } from "../../types/class.types";
import { getFirebaseDatabase } from "../../initialize/initialize";
import { RecordSchema, ObjectFromRecord, FirebaseTable } from "../../types/schema.types";

/**
 * Adds default class methods and properties onto the `BaseClass`
 */
const addBaseClassCache = <Schema extends RecordSchema>(
  BaseClass: BaseClass<Schema>
): void => {
  let cache: FirebaseTable<Schema> = {}

  BaseClass.cache = async function (): Promise<FirebaseTable<Schema>> {
    await BaseClass.ref().once('value', async (snapshot) => {
      cache = snapshot.val()
    })
    return cache
  }

  Object.defineProperty(BaseClass, 'cached', {
    get() {
      return cache
    }
  })
}

export default addBaseClassCache