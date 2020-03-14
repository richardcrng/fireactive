import { get } from 'lodash'
import { plural } from 'pluralize'
import { ActiveRecord, BaseClass } from "../../types/class.types";
import { RecordSchema, ToCreateRecord, ObjectFromRecord } from "../../types/schema.types";
import checkPrimitive from './checkPrimitive';

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
  ): void {
    
    // assign initial props
    Object.assign(this, props)

    let syncIsOn = true
    
    this.syncIsOn = () => syncIsOn
    this.toggleSync = () => {
      syncIsOn = !syncIsOn
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