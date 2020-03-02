import { RecordSchema, ActiveRecord, ToCreateRecord, ObjectFromRecord } from "../types/record.types";
import { FieldIdentifier } from "../types/field.types";

const makeRecordConstructor = <Schema extends RecordSchema>(modelName: string, schema: Schema) => {
  return function recordConstructor (
    this: ActiveRecord<Schema>,
    props: ToCreateRecord<Schema> & { _id?: string }
  ): void {

    Object.keys(schema).forEach(key => {
      const schemaKey = key as keyof ObjectFromRecord<Schema>
      // @ts-ignore : set it from props, if it exists there
      this[schemaKey] = props[schemaKey]

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
    })
  }
}

export default makeRecordConstructor