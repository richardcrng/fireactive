import { BaseClass } from "../../types/class.types";
import { RecordSchema, FirebaseTable } from "../../types/schema.types";

/**
 * Adds default class methods and properties onto the `BaseClass`
 */
const addActiveClassCache = <Schema extends RecordSchema>(
  BaseClass: BaseClass<Schema>
): void => {
  const updateCacheFromSnapshot = (snapshot: firebase.database.DataSnapshot) => {
    BaseClass.cached = snapshot.val() as FirebaseTable<Schema>
  }

  BaseClass.cache = async function (listenForUpdates = true): Promise<FirebaseTable<Schema>> {
    BaseClass.ref().off('value', updateCacheFromSnapshot)
    await BaseClass.ref().once('value', updateCacheFromSnapshot)
    if (listenForUpdates) {
      BaseClass.ref().on('value', updateCacheFromSnapshot)
    }
    return BaseClass.cached
  }
}

export default addActiveClassCache