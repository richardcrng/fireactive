import { ActiveDocument } from "../../types/class.types"
import { DocumentSchema } from "../../types/schema.types"
import { SyncOpts } from "../../types/sync.types"

interface KWArgs<Schema extends DocumentSchema> {
  document: ActiveDocument<Schema>,
  checkAgainstSchema: Function
}

function setupSyncing<Schema extends DocumentSchema>({
  document,
  checkAgainstSchema
}: KWArgs<Schema>) {
  let syncFromDb: boolean = false
  let syncToDb: boolean = false
  let syncCount: number = 0

  let pendingSetters: Promise<any>[] = []
  document.pendingSetters = (opts?: { array: true }): any => {
    return opts && opts.array
      ? [...pendingSetters] // stop users mutating the underlying array
      : Promise.all(pendingSetters)
  }

  const syncFromSnapshot = (snapshot: firebase.database.DataSnapshot) => {
    Object.assign(document, snapshot.val())
    checkAgainstSchema()
  }

  const alignHandlersSyncingFromDb = () => {
    if (syncFromDb && syncCount < 1 && document.getId()) {
      document.ref().on('value', syncFromSnapshot)
      syncCount++
    }
    if (!syncFromDb && syncCount > 0 && document.getId()) {
      while (syncCount > 0 && document.getId()) {
        document.ref().off('value', syncFromSnapshot)
        syncCount--
      }
    }
  }

  document.syncOpts = ({ fromDb, toDb }: Partial<SyncOpts> = {}): SyncOpts => {
    if (typeof fromDb !== 'undefined') syncFromDb = fromDb
    if (typeof toDb !== 'undefined') syncToDb = toDb
    alignHandlersSyncingFromDb()
    return { fromDb: syncFromDb, toDb: syncToDb }
  }

  return { pendingSetters }
}

export default setupSyncing