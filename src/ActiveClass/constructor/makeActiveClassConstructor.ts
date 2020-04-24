import { get, set } from 'lodash'
import { plural } from 'pluralize'
import { ActiveDocument, ActiveClass } from "../../types/class.types";
import { DocumentSchema, ToCreateDocument, ObjectFromDocument } from "../../types/schema.types";
import checkPrimitive from './checkPrimitive';
import withOnChangeListener from './withOnChangeListener';
import setupSyncing from './setupSyncing';
import ActiveClassError from '../Error/ActiveClassError';

/**
 * Creates a constructor function for a `DocumentModel<Schema>`
 * 
 * @param schema - The schema that the model uses
 * @param className - The name of the model, used as a basis for the Firebase table name
 */
const makeActiveClassConstructor = <Schema extends DocumentSchema>(
  schema: Schema,
  className?: string
) => { 
  /**
   * A constructor function for a Fireactive `ActiveDocument`.
   */
  function ActiveDocument (
    this: ActiveDocument<Schema>,
    // @ts-ignore : allow instantiation with no argument
    props: ToCreateDocument<Schema> & { _id?: string } = {}
  ) {
    
    // assign initial props
    Object.assign(this, props)

    const document = this

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
        checkPrimitive.bind(this)({ schema, schemaKeyPath })
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
        const schemaKey = key as keyof ObjectFromDocument<Schema>
        // @ts-ignore : set it from props, if it exists there
        if (initialiseFromProps) document[schemaKey] = props[schemaKey]

        iterativelyCheckAgainstSchema([key])
      })
    }

    try {
      checkAgainstSchema(true)
    } catch (err) {
      throw ActiveClassError.from(err, {
        what: `Could not construct ${this.constructor.name}`
      })
    }

    // @ts-ignore : possibly infinitely deep :(
    const { pendingSetters } = setupSyncing({ document, checkAgainstSchema })

    return withOnChangeListener({ document, checkAgainstSchema, pendingSetters })
  }

  /**
   * Set the `name` property to be the className passed in,
   *  and the `key` property to be the pluralised version of name.
   *  (We're using a getter because `name` might get updated at some point?
   *  Not sure why, but seems plausible that it might happen, e.g. to
   *  deliberately change which database is used.
   */

  if (className) {
    Object.defineProperty(ActiveDocument, 'name', { value: className })
  }
  
  Object.defineProperty(ActiveDocument, 'key', {
    get(this: ActiveClass<Schema>) {
      return plural(this.name)
    }
  })

  

  return ActiveDocument
}

export default makeActiveClassConstructor