import { identical, equals } from 'ramda'
import { get, remove, set, unset } from 'lodash'
import onChange from 'on-change'
import { ActiveDocument } from '../../types/class.types'
import { DocumentSchema } from '../../types/schema.types'
import ActiveClassError from '../Error/ActiveClassError'
import { FieldIdentifier } from '../../types/field.types'

interface KWArgs<Schema extends DocumentSchema> {
  document: ActiveDocument<Schema>,
  checkAgainstSchema: Function,
  pendingSetters: Promise<any>[]
}

/**
 * Return a proxied version of the document which:
 *  (a) checks a property change against the schema
 *        and throws an error if it is inconsistent
 *  (b) if the document's syncOpts are set to sync to db,
 *        syncs to the database on every property set 
 * 
 * @param kwargs - Keyword arguments object 
 */
function withOnChangeListener<Schema extends DocumentSchema>({
  document,
  checkAgainstSchema,
  pendingSetters
}: KWArgs<Schema>) {
  /**
   * https://github.com/sindresorhus/on-change
   *
   * `pendingSetters` is used to provide something
   *  awaitable for all pending database changes.
   */
  return onChange(document, function (path, val, prevVal) {
    // check against schema
    // this will throw an error for incompatible values

    const pathArr = path.split('.')

    // @ts-ignore
    const existsOnSchemaDirectly: boolean = !!get(document.constructor.schema, pathArr)
    // @ts-ignore
    const ancestorIsAnIndex: boolean = get(document.constructor.schema, [...pathArr.slice(0, -1), '_fieldIdentifier']) === FieldIdentifier.indexed

    const shouldCheck = existsOnSchemaDirectly || ancestorIsAnIndex

    try {
      if (shouldCheck) {
        checkAgainstSchema()
      }
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

    if (shouldCheck && document.syncOpts().toDb) {
      let ref: firebase.database.Reference = document.ref()
      const propPath = path.replace(/\./g, '/')
      // to remove undefined properties: https://stackoverflow.com/questions/34708566/firebase-update-failed-first-argument-contains-undefined-in-property
      const valToUpdate = JSON.parse(JSON.stringify(val))
      if (propPath) {
        ref = ref.child(propPath)
      }
      ref.once('value', snapshot => {
        const presentVal = snapshot.val()
        if (!equals(valToUpdate, presentVal)) {
          const promiseToDb = ref.set(valToUpdate)
          pendingSetters.push(promiseToDb)
          promiseToDb.then(() => {
            remove(pendingSetters, identical(promiseToDb))
          })
        }
      })
    }
  })
}

export default withOnChangeListener