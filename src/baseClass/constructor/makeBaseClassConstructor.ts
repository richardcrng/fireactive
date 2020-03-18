import { get, remove } from 'lodash'
import { identical } from 'ramda'
import onChange from 'on-change'
import { plural } from 'pluralize'
import { ActiveRecord, BaseClass } from "../../types/class.types";
import { RecordSchema, ToCreateRecord, ObjectFromRecord } from "../../types/schema.types";
import checkPrimitive from './checkPrimitive';
import { SyncOpts } from '../../types/sync.types';

/**
 * Creates a constructor function for a `RecordModel<Schema>`
 * 
 * @param className - The name of the model, used as a basis for the Firebase table name
 * @param schema - The schema that the model uses
 */
const makeBaseClassConstructor = <Schema extends RecordSchema>(
  className: string,
  schema: Schema
) => {
  /**
   * A constructor function for a Fireactive Base Class.
   */
  function baseClassConstructor (
    this: ActiveRecord<Schema>,
    props: ToCreateRecord<Schema> & { _id?: string }
  ) {
    
    // assign initial props
    Object.assign(this, props)

    const record = this

    let syncFromDb: boolean = false
    let syncToDb: boolean = false
    let syncCount: number = 0

    let pendingSetters: Promise<any>[] = []
    this.pendingSetters = (opts?: { array: true }): any => {
      return opts?.array
        ? [...pendingSetters] // stop users mutating the underlying array
        : Promise.all(pendingSetters)
    }

    const syncFromSnapshot = (snapshot: firebase.database.DataSnapshot) => {
      Object.assign(record, snapshot.val())
    }

    const alignHandlersSyncingFromDb = () => {
      if (syncFromDb && syncCount < 1 && this.getId()) {
        const db = this.constructor.getDb()
        db.ref(this.constructor.key).child(this.getId()).on('value', syncFromSnapshot)
        syncCount++
      }
      if (!syncFromDb && syncCount > 0 && this.getId()) {
        const db = this.constructor.getDb()
        while (syncCount > 0 && this.getId()) {
          db.ref(this.constructor.key).child(this.getId()).off('value', syncFromSnapshot)
          syncCount--
        }
      }
    }

    this.syncOpts = ({ fromDb, toDb }: Partial<SyncOpts> = {}): SyncOpts => {
      if (typeof fromDb !== 'undefined') syncFromDb = fromDb
      if (typeof toDb !== 'undefined') syncToDb = toDb
      alignHandlersSyncingFromDb()
      return { fromDb: syncFromDb, toDb: syncToDb }
    }

    const schemaFieldIdentified = (path: string[]) => get(schema, [...path, '_fieldIdentifier'])

    /**
     * Check whether the object conforms to the schema at a given path,
     *  including iterating within child keys if it's an object at
     *  that particular path
     * 
     * @param schemaKeyPath - The path from the object to the field
     *  to be checked
     */
    const iterativelyCheckAgainstSchema = (schemaKeyPath: string[]) => {
      if (schemaFieldIdentified(schemaKeyPath)) {
        // @ts-ignore : infinitely deep :(
        checkPrimitive.bind(this)({ schema, schemaKeyPath, className })
      } else {
        // assume it's an object and iteratively check keys
        Object.keys(get(schema, schemaKeyPath)).forEach(childKey => {
          iterativelyCheckAgainstSchema([...schemaKeyPath, childKey])
        })
      }
    }

    Object.keys(schema).forEach(key => {
      const schemaKey = key as keyof ObjectFromRecord<Schema>
      // @ts-ignore : set it from props, if it exists there
      this[schemaKey] = props[schemaKey]

      iterativelyCheckAgainstSchema([key])
    })

    /**
     * https://github.com/sindresorhus/on-change
     * 
     * Return a proxied version of the instance
     *  which syncs to the realtime database
     *  on every set if `syncToDb` is truthy.
     * 
     * `pendingSetters` is used to provide something
     *  awaitable for all pending database changes.
     */
    return onChange(this, function(path, val) {
      if (record.syncOpts().toDb) {
        const db = this.constructor.getDb()
        const thisRef = db.ref(this.constructor.key).child(this.getId())
        const propPath = path.replace(/\./g, '/')
        const promiseToDb = thisRef.child(propPath).set(val)
        pendingSetters.push(promiseToDb)
        promiseToDb.then(() => {
          remove(pendingSetters, identical(promiseToDb))
        })
      }
    })
  }

  /**
   * Set the `name` property to be the className passed in,
   *  and the `key` property to be the pluralised version of name.
   *  (We're using a getter because `name` might get updated at some point?
   *  Not sure why, but seems plausible that it might happen, e.g. to
   *  deliberately change which database is used.
   */
  Object.defineProperty(baseClassConstructor, 'name', { value: className })
  Object.defineProperty(baseClassConstructor, 'key', {
    get(this: BaseClass<Schema>) {
      return plural(this.name)
    }
  })

  

  return baseClassConstructor
}

export default makeBaseClassConstructor