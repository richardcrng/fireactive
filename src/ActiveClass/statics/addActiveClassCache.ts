import { ActiveClass } from "../../types/class.types";
import { RecordSchema, FirebaseTable } from "../../types/schema.types";

/**
 * Adds default class methods and properties onto the `ActiveClass`
 */
const addActiveClassCache = <Schema extends RecordSchema>(
  ActiveClass: ActiveClass<Schema>
): void => {
  const updateCacheFromSnapshot = (snapshot: firebase.database.DataSnapshot) => {
    ActiveClass.cached = snapshot.val() || {} as FirebaseTable<Schema>
  }

  ActiveClass.cache = async function (listenForUpdates = true): Promise<FirebaseTable<Schema>> {
    this.ref().off('value', updateCacheFromSnapshot)
    await this.ref().once('value', updateCacheFromSnapshot)
    if (listenForUpdates) {
      this.ref().on('value', updateCacheFromSnapshot)
    }
    return this.cached
  }
}

export default addActiveClassCache