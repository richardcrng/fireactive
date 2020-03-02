import { database } from 'firebase'
import { UndefinedToOptional } from "./util.types"
import { CreateField, RecordField, FieldDefinition, FieldIdentifier, FieldType } from "./field.types"
import Schema from "../Schema"

type SchemaField<FI extends FieldIdentifier = FieldIdentifier> = (FieldDefinition | typeof Schema.boolean | typeof Schema.number | typeof Schema.string) & {
  _hasDefault?: boolean
} & {
  default?: FieldType<FI>
}

export interface RecordSchema {
  [key: string]: SchemaField
}

/**
 * Specifies the options argument for creating a record
 * @template S - A Schema of Fields
 */
export type ToCreateRecord<S extends RecordSchema> = UndefinedToOptional<{
  [K in keyof S]: CreateField<S[K]>
}>

/**
 * Specifies the properties available on a record
 * @template S - A Schema of Fields
 */
export type RecordProps<S extends RecordSchema> = UndefinedToOptional<{
  [K in keyof S]: RecordField<S[K]>
}>

/**
 * @template S - A Schema of Fields
 */
export type ObjectFromRecord<S extends RecordSchema> = RecordProps<S> & { _id?: string }

/**
 * The default properties and instance methods on an ActiveRecord
 */
export type ActiveRecord<S extends RecordSchema> = ObjectFromRecord<S> & {
  constructor: RecordModel<S>

  // instance methods on an ActiveRecord
  save(): Promise<void>,
  toObject(): ObjectFromRecord<S>
}

/**
 * The default properties and class methods of an ActiveRecord class
 */
export interface RecordModel<S extends RecordSchema> {
  new(props: ToCreateRecord<S> & { _id?: string }): ActiveRecord<S>;
  prototype: ActiveRecord<S>;

  create(props: ToCreateRecord<S> & { _id?: string }): Promise<ActiveRecord<S>>;
  getDb(): firebase.database.Database;
}