import { UndefinedToOptional } from "../types/util.types"

export interface FieldOptions<T> {
  // default?: T,
}

/**
 * @template R - is field required on the record?
 * @template D - does the field initialise with a default value?
 */
export type FieldDefinition<T = any, R extends boolean = boolean, D extends boolean = boolean> = FieldOptions<T> & {
  _fieldIdentifier: T extends string ? FieldIdentifier.string
  : T extends number ? FieldIdentifier.number
  : T extends boolean ? FieldIdentifier.boolean
  : unknown
} & {
  required: R
} & (D extends true ? { _hasDefault: true } : { _hasDefault: false })

export enum FieldIdentifier {
  string = 'STRING_FIELD_IDENTIFIER',
  number = 'NUMBER_FIELD_IDENTIFIER',
  boolean = 'BOOLEAN_FIELD_IDENTIFIER'
}

type TypeFromIdentifier<T> =
  T extends FieldIdentifier.string ? string
  : T extends FieldIdentifier.number ? number
  : T extends FieldIdentifier.boolean ? boolean
  : unknown

/**
 * Converts a FieldDefinition to a value that the record holds
 */
type RecordField<FD> =
  FD extends { _fieldIdentifier: infer C, required: false } ? TypeFromIdentifier<C> | undefined
  : FD extends { _fieldIdentifier: infer C } ? TypeFromIdentifier<C>
  : unknown

/**
 * Converts a FieldDefinition to a value taken by the record on initialisation
 */
type CreateField<FD> =
  FD extends { _fieldIdentifier: infer C, _hasDefault: true } ? TypeFromIdentifier<C> | undefined
  : FD extends { _fieldIdentifier: infer C, required: false } ? TypeFromIdentifier<C> | undefined
  : FD extends { _fieldIdentifier: infer C } ? TypeFromIdentifier<C>
  : unknown

export type ToCreateRecord<S> = UndefinedToOptional<{
  [K in keyof S]: CreateField<S[K]>
}>

export type RecordProps<S> = UndefinedToOptional<{
  [K in keyof S]: RecordField<S[K]>
}>

export type RecordObject<S> = RecordProps<S> & { _id?: string }