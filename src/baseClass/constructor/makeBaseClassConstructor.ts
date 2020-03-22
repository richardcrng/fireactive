import { get, set } from 'lodash'
import { plural } from 'pluralize'
import { ActiveRecord, BaseClass } from "../../types/class.types";
import { RecordSchema, ToCreateRecord, ObjectFromRecord } from "../../types/schema.types";
import checkPrimitive from './checkPrimitive';
import withOnChangeListener from './withOnChangeListener';
import setupSyncing from './setupSyncing';

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
        // probably an object
        if (typeof get(this, schemaKeyPath) === 'undefined') {
          // if it's undefined as a property, set it to empty object
          set(this, schemaKeyPath, {})
        }
        // iteratively check keys
        Object.keys(get(schema, schemaKeyPath)).forEach(childKey => {
          iterativelyCheckAgainstSchema([...schemaKeyPath, childKey])
        })
      }
    }

    const checkAgainstSchema = (initialiseFromProps = false) => {
      Object.keys(schema).forEach(key => {
        const schemaKey = key as keyof ObjectFromRecord<Schema>
        // @ts-ignore : set it from props, if it exists there
        if (initialiseFromProps) record[schemaKey] = props[schemaKey]

        iterativelyCheckAgainstSchema([key])
      })
    }

    checkAgainstSchema(true)

    // @ts-ignore : possibly infinitely deep :(
    const pendingSetters = setupSyncing({ record, checkAgainstSchema })

    return withOnChangeListener({ record, checkAgainstSchema, pendingSetters })
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