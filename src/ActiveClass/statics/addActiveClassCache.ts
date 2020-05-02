import { ActiveClass } from "../../types/class.types";
import { DocumentSchema, FirebaseTable } from "../../types/schema.types";

interface CacheOpts {
  fetchNow?: boolean
  listenForUpdates?: boolean
}

/**
 * Adds cache method onto the `ActiveClass`
 */
const addActiveClassCache = <Schema extends DocumentSchema>(
  ActiveClass: ActiveClass<Schema>
): void => {
  // let cached: FirebaseTable<Schema>

  const updateCacheFromSnapshot = (snapshot: firebase.database.DataSnapshot) => {
    ActiveClass.cached = snapshot.val() || {} as FirebaseTable<Schema>
  }

  ActiveClass.cache = async function ({ fetchNow = true, listenForUpdates }: CacheOpts = {}): Promise<FirebaseTable<Schema>> {
    if (fetchNow) {
      await this.ref().once('value', updateCacheFromSnapshot)
    }

    if (listenForUpdates === true) {
      // turn off to make sure we never double up listeners
      this.ref().off('value', updateCacheFromSnapshot)
      this.ref().on('value', updateCacheFromSnapshot)
    } else if (listenForUpdates === false) {
      this.ref().off('value', updateCacheFromSnapshot)
    }

    return this.cached
  }
}

export default addActiveClassCache