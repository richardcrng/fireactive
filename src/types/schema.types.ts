import { UndefinedToOptional } from './util.types'
import { FieldIdentifier, FieldDefinition, CreateField, FieldType, DocumentField, IndexedFieldDefinition } from './field.types'
import Schema from '../Schema'

type SchemaField<FI extends FieldIdentifier = FieldIdentifier> = (IndexedFieldDefinition | FieldDefinition | typeof Schema.boolean | typeof Schema.number | typeof Schema.string) & {
  _hasDefault?: boolean
} & {
  default?: FieldType<FI>
}

export type SchemaProperty = SchemaField | {
  [key: string]: SchemaProperty
}

export interface DocumentSchema {
  [key: string]: SchemaProperty
}

/**
 * Specifies the options argument for creating a document
 * @template S - A Schema of Fields
 */
export type ToCreateDocument<S extends DocumentSchema> = UndefinedToOptional<{
  [K in keyof S]: CreateField<S[K]>
}>

/**
 * Specifies the properties available on a document
 * @template S - A Schema of Fields
 */
export type DocumentProps<S extends DocumentSchema> = UndefinedToOptional<{
  [K in keyof S]: DocumentField<S[K]>
}>

/**
 * @template S - A Schema of Fields
 */
export type ObjectFromDocument<S extends DocumentSchema> = DocumentProps<S> & { _id?: string }

export interface FirebaseTable<S extends DocumentSchema> {
  [_id: string]: ObjectFromDocument<S> & { _id: string }
}