import { ActiveRecord } from "../../types/class.types"
import { RecordSchema } from "../../types/schema.types"
import { SyncOpts } from "../../types/sync.types"

function setupSyncing<Schema extends RecordSchema>(record: ActiveRecord<Schema>) {
  let syncFromDb: boolean = false
  let syncToDb: boolean = false
  let syncCount: number = 0

  let pendingSetters: Promise<any>[] = []
  record.pendingSetters = (opts?: { array: true }): any => {
    return opts?.array
      ? [...pendingSetters] // stop users mutating the underlying array
      : Promise.all(pendingSetters)
  }

  const syncFromSnapshot = (snapshot: firebase.database.DataSnapshot) => {
    Object.assign(record, snapshot.val())
  }

  const alignHandlersSyncingFromDb = () => {
    if (syncFromDb && syncCount < 1 && record.getId()) {
      record.ref().on('value', syncFromSnapshot)
      syncCount++
    }
    if (!syncFromDb && syncCount > 0 && record.getId()) {
      while (syncCount > 0 && record.getId()) {
        record.ref().off('value', syncFromSnapshot)
        syncCount--
      }
    }
  }

  record.syncOpts = ({ fromDb, toDb }: Partial<SyncOpts> = {}): SyncOpts => {
    if (typeof fromDb !== 'undefined') syncFromDb = fromDb
    if (typeof toDb !== 'undefined') syncToDb = toDb
    alignHandlersSyncingFromDb()
    return { fromDb: syncFromDb, toDb: syncToDb }
  }

  return pendingSetters
}

export default setupSyncing