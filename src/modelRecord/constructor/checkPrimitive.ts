import { ActiveRecord } from '../../types/record.types'
import { RecordSchema, ObjectFromRecord } from '../../types/schema.types';
import { FieldIdentifier } from '../../types/field.types';

interface A<Schema extends RecordSchema> {
  schema: Schema,
  schemaKey: keyof ObjectFromRecord<Schema>,
  modelName: string
}

function checkPrimitive<Schema extends RecordSchema>(this: ActiveRecord<Schema>, {
  schema,
  schemaKey,
  modelName
}: A<Schema>) {
  // @ts-ignore : check if schema specifies default and if it's currently undefined
  if (schema[schemaKey]._hasDefault && typeof this[schemaKey] === 'undefined') {
    this[schemaKey] = schema[schemaKey].default
  }

  // @ts-ignore : check if schema requires property but it's undefined
  if (schema[schemaKey].required && typeof this[schemaKey] === 'undefined') {
    throw new Error(`Failed to create ${modelName}: missing the required property ${schemaKey}`)
  }

  // @ts-ignore : check if field matches type if defined
  if (!(typeof this[schemaKey] === 'undefined')) {
    let doesMatch = true
    switch (schema[schemaKey]._fieldIdentifier) {
      case FieldIdentifier.string:
        doesMatch = typeof this[schemaKey] === 'string'; break
      case FieldIdentifier.number:
        doesMatch = typeof this[schemaKey] === 'number'; break
      case FieldIdentifier.boolean:
        doesMatch = typeof this[schemaKey] === 'boolean'; break
    }

    if (!doesMatch) {
      throw new Error(`Failed to create ${modelName}: property ${schemaKey} is of the wrong type`)
    }
  }
}

export default checkPrimitive