import { UndefinedToOptional } from './util.types'
import { FieldIdentifier, FieldDefinition, CreateField, FieldType, RecordField } from './field.types'
import Schema from '../Schema'

type SchemaField<FI extends FieldIdentifier = FieldIdentifier> = (FieldDefinition | typeof Schema.boolean | typeof Schema.number | typeof Schema.string) & {
  _hasDefault?: boolean
} & {
  default?: FieldType<FI>
}

type SchemaProperty = SchemaField | {
  [key: string]: SchemaProperty
}

export interface RecordSchema {
  [key: string]: SchemaProperty
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