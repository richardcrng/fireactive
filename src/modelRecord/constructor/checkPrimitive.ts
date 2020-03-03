import { get, set, isUndefined } from 'lodash'
import { ActiveRecord } from '../../types/record.types'
import { RecordSchema, ObjectFromRecord } from '../../types/schema.types';
import { FieldIdentifier } from '../../types/field.types';

interface A<Schema extends RecordSchema> {
  schema: Schema,
  schemaKeyPath: string[],
  modelName: string
}

function checkPrimitive<Schema extends RecordSchema>(this: ActiveRecord<Schema>, {
  schema,
  schemaKeyPath,
  modelName
}: A<Schema>) {
  /**
   * Check the current value at the current schema key path.
   *  Wrap in a function as we don't want to only retrieve
   *  the value right now - we want to 
   */
  const currentValAtPath = () => get(this, [...schemaKeyPath])
  const schemaVal = get(schema, schemaKeyPath)

  // check if the path has the `_hasDefault` property and is undefined
  if (schemaVal?._hasDefault && typeof currentValAtPath() === 'undefined') {
    const defaultVal = get(schema, [...schemaKeyPath, 'default'])
    set(this, schemaKeyPath, defaultVal)
  }

  if (schemaVal?.required && typeof currentValAtPath() === 'undefined') {
    throw new Error(`Failed to create ${modelName}: missing the required property ${schemaKeyPath.join('.')}`)
  }

  if (!(typeof currentValAtPath() === 'undefined')) {
    let doesMatch = true
    switch (schemaVal?._fieldIdentifier) {
      case FieldIdentifier.string:
        doesMatch = typeof currentValAtPath() === 'string'; break
      case FieldIdentifier.number:
        doesMatch = typeof currentValAtPath() === 'number'; break
      case FieldIdentifier.boolean:
        doesMatch = typeof currentValAtPath() === 'boolean'; break
    }

    if (!doesMatch) {
      throw new Error(`Failed to create ${modelName}: property ${schemaKeyPath.join('.')} is of the wrong type`)
    }
  }
}

export default checkPrimitive