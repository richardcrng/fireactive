import { get, set } from 'lodash'
import { ActiveRecord } from '../../types/class.types'
import { RecordSchema } from '../../types/schema.types';
import { FieldIdentifier } from '../../types/field.types';
import ActiveClassError from '../Error/ActiveClassError';

interface A<Schema extends RecordSchema> {
  schema: Schema,
  schemaKeyPath: string[]
}

function checkPrimitive<Schema extends RecordSchema>(this: ActiveRecord<Schema>, {
  schema,
  schemaKeyPath
}: A<Schema>) {

  const defaultErrorWhat = `Could not set or update ${this.constructor.name}`

  /**
   * Check the current value at the current schema key path.
   *  Wrap in a function as we don't want to only retrieve
   *  the value right now - we want to 
   */
  const currentValAtPath = () => get(this, [...schemaKeyPath])
  const schemaFieldDef = get(schema, schemaKeyPath)

  // check if the path has the `_hasDefault` property and is undefined
  if (get(schemaFieldDef, '_hasDefault') && typeof currentValAtPath() === 'undefined') {
    const defaultVal = get(schema, [...schemaKeyPath, 'default'])
    set(this, schemaKeyPath, defaultVal)
  }

  if (get(schemaFieldDef, 'required') && typeof currentValAtPath() === 'undefined') {
    throw new ActiveClassError({
      what: defaultErrorWhat,
      why: `The required property '${schemaKeyPath.join('.')}' is missing`
    })
  }

  if (currentValAtPath() == null) {
    if (schemaFieldDef && schemaFieldDef._fieldIdentifier === FieldIdentifier.indexed) {
      set(this, schemaKeyPath, {})
    }
  } else {
    let doesMatch = true
    switch (schemaFieldDef && schemaFieldDef._fieldIdentifier) {
      case FieldIdentifier.string:
        doesMatch = typeof currentValAtPath() === 'string'; break
      case FieldIdentifier.number:
        doesMatch = typeof currentValAtPath() === 'number'; break
      case FieldIdentifier.boolean:
        doesMatch = typeof currentValAtPath() === 'boolean'; break
      case FieldIdentifier.enum:
        // the enum values are on the field definition's vals property
        doesMatch = schemaFieldDef.vals.includes(currentValAtPath()); break
      case FieldIdentifier.indexed:
        doesMatch = Object.values(currentValAtPath()).every(val => {
          if (typeof val === 'undefined') return true
          switch (get(schemaFieldDef, ['indexed', '_fieldIdentifier'])) {
            case FieldIdentifier.string:
              return typeof val === 'string'
            case FieldIdentifier.number:
              return typeof val === 'number'
            case FieldIdentifier.boolean:
              return typeof val === 'boolean'
            case FieldIdentifier.enum:
              return schemaFieldDef.indexed.vals.includes(val)
          }
        })
        break
    }

    if (!doesMatch) {
      throw new ActiveClassError({
        what: defaultErrorWhat,
        why: `The property '${schemaKeyPath.join('.')}' is of the wrong type`
      })
    }
  }
}

export default checkPrimitive