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

  /**
   * Save the instance to Firebase
   */
  save(): Promise<void>,

  /**
   * Return the raw object properties (as schematised)
   * @returns an object with type properties `ObjectFromRecord<S>`
   */
  toObject(): ObjectFromRecord<S>
}

/**
 * A class to create ActiveRecord instances of `S`
 * This interface holds the static class methods and properties
 * 
 * @template S - a RecordSchema
 */
export interface RecordModel<S extends RecordSchema> {
  /**
   * Create an instance of the ActiveRecord -
   *  not yet saved to the database
   */
  new(props: ToCreateRecord<S> & { _id?: string }): ActiveRecord<S>;
  prototype: ActiveRecord<S>;

  /**
   * Create a new model and save it to the database
   * 
   * @param props Properties to create the Record with
   * @returns a `Promise` that resolves into the created record
   */
  create(props: ToCreateRecord<S> & { _id?: string }): Promise<ActiveRecord<S>>;

  /**
   * Return the Firebase Real-Time Database instance and interface
   * @returns `firebase.database.Database`
   */
  getDb(): firebase.database.Database;
}