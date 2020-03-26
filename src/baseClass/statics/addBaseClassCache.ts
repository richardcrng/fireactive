import { BaseClass } from "../../types/class.types";
import { RecordSchema, FirebaseTable } from "../../types/schema.types";

/**
 * Adds default class methods and properties onto the `BaseClass`
 */
const addBaseClassCache = <Schema extends RecordSchema>(
  BaseClass: BaseClass<Schema>
): void => {
  let cache: FirebaseTable<Schema> = {}

  const updateCacheFromSnapshot = (snapshot: firebase.database.DataSnapshot) => {
    cache = snapshot.val()
  }

  BaseClass.cache = async function (listenForUpdates = true): Promise<FirebaseTable<Schema>> {
    BaseClass.ref().off('value', updateCacheFromSnapshot)
    await BaseClass.ref().once('value', updateCacheFromSnapshot)
    if (listenForUpdates) {
      BaseClass.ref().on('value', updateCacheFromSnapshot)
    }
    return cache
  }

  Object.defineProperty(BaseClass, 'cached', {
    get() {
      return cache
    }
  })
}

export default addBaseClassCache