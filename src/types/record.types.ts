import { UndefinedToOptional } from "./util.types"
import { CreateField, RecordField, FieldDefinition } from "./field.types"
import Schema from "../Schema"

type SchemaField = FieldDefinition | typeof Schema.boolean | typeof Schema.number | typeof Schema.string 

export interface RecordSchema {
  [key: string]: SchemaField
}

/**
 * @template S - A Schema of Fields
 */
export type ToCreateRecord<S extends RecordSchema> = UndefinedToOptional<{
  [K in keyof S]: CreateField<S[K]>
}>

/**
 * @template S - A Schema of Fields
 */
export type RecordProps<S extends RecordSchema> = UndefinedToOptional<{
  [K in keyof S]: RecordField<S[K]>
}>

/**
 * @template S - A Schema of Fields
 */
export type ObjectFromRecord<S extends RecordSchema> = RecordProps<S> & { _id?: string }

export type ActiveRecord<S extends RecordSchema> = ObjectFromRecord<S> & {
  save(): Promise<void>,
  toObject(): ObjectFromRecord<S>
}