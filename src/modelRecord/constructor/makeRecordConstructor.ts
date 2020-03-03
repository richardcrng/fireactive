import { ActiveRecord } from "../../types/record.types";
import { FieldIdentifier } from "../../types/field.types";
import { RecordSchema, ToCreateRecord, ObjectFromRecord } from "../../types/schema.types";
import checkPrimitive from './checkPrimitive';

/**
 * Creates a constructor function for a `RecordModel<Schema>`
 * 
 * @param modelName - The name of the model, used as a basis for the Firebase table name
 * @param schema - The schema that the model uses
 */
const makeRecordConstructor = <Schema extends RecordSchema>(modelName: string, schema: Schema) => {
  return function recordConstructor (
    this: ActiveRecord<Schema>,
    props: ToCreateRecord<Schema> & { _id?: string }
  ): void {

    Object.keys(schema).forEach(key => {
      const schemaKey = key as keyof ObjectFromRecord<Schema>
      // @ts-ignore : set it from props, if it exists there
      this[schemaKey] = props[schemaKey]

      // @ts-ignore : infinitely deep :(
      checkPrimitive.bind(this)({ schema, schemaKey, modelName })
    })
  }
}

export default makeRecordConstructor