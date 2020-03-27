// @ts-nocheck

import { identical } from 'ramda'
import { remove, set, unset } from 'lodash'
import onChange from 'on-change'
import { ActiveRecord } from '../../types/class.types'
import { RecordSchema } from '../../types/schema.types'
import ActiveClassError from '../Error/ActiveClassError'

interface KWArgs<Schema extends RecordSchema> {
  record: ActiveRecord<Schema>,
  checkAgainstSchema: Function,
  pendingSetters: Promise<any>[]
}

/**
 * Return a proxied version of the record which:
 *  (a) checks a property change against the schema
 *        and throws an error if it is inconsistent
 *  (b) if the record's syncOpts are set to sync to db,
 *        syncs to the database on every property set 
 * 
 * @param kwargs - Keyword arguments object 
 */
function withOnChangeListener<Schema extends RecordSchema>({
  record,
  checkAgainstSchema,
  pendingSetters
}: KWArgs<Schema>) {
  /**
   * https://github.com/sindresorhus/on-change
   *
   * `pendingSetters` is used to provide something
   *  awaitable for all pending database changes.
   */
  return onChange(record, function (path, val, prevVal) {
    // check against schema
    // this will throw an error for incompatible values
    try {
      checkAgainstSchema()
    } catch (err) {
      // revert to previous value
      if (prevVal === 'undefined') {
        unset(this, path)
      } else {
        set(this, path, prevVal)
      }

      throw ActiveClassError.from(err, {
        what: `${this.constructor.name} could not accept the value ${JSON.stringify(val)} (${typeof val}) at path '${path}'`
      })
    }

    if (record.syncOpts().toDb) {
      const thisRef = this.ref()
      const propPath = path.replace(/\./g, '/')
      const promiseToDb = thisRef.child(propPath).set(val)
      pendingSetters.push(promiseToDb)
      promiseToDb.then(() => {
        remove(pendingSetters, identical(promiseToDb))
      })
    }
  })
}

export default withOnChangeListener