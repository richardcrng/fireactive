import { UndefinedToOptional } from "../types/util.types"

export interface FieldOptions<T> {
  default?: T,
}

type FieldConstructor<T = any> = (opts?: FieldOptions<T>) => void

type FieldFunction<Identifier = any> = Identifier extends string ? FieldConstructor<string> & { _fieldIdentifier: FieldIdentifier.string }
  : Identifier extends number ? FieldConstructor<number> & { _fieldIdentifier: FieldIdentifier.number }
  : Identifier extends boolean ? FieldConstructor<boolean> & { _fieldIdentifier: FieldIdentifier.boolean }
  : FieldConstructor & FieldIdentifier

export type FieldConfiguration<T = any, R extends boolean = boolean, D extends boolean = boolean> = FieldOptions<T> & {
  _fieldIdentifier: T extends string ? FieldIdentifier.string
  : T extends number ? FieldIdentifier.number
  : T extends boolean ? FieldIdentifier.boolean
  : unknown
} & {
  required: R
} & (D extends true ? { _hasDefault: true } : {})

export type FieldDefinition = FieldFunction | FieldConfiguration

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

type RecordField<FD> =
  FD extends { _fieldIdentifier: infer C, required: false } ? TypeFromIdentifier<C> | undefined
  : FD extends { _fieldIdentifier: infer C, required: true } ? TypeFromIdentifier<C>
  : FD extends { _fieldIdentifier: infer C } ? TypeFromIdentifier<C>
  : unknown

type PropsField<FD> =
  FD extends { _fieldIdentifier: infer C, _hasDefault: true } ? TypeFromIdentifier<C> | undefined
  : FD extends { _fieldIdentifier: infer C, required: false } ? TypeFromIdentifier<C> | undefined
  : FD extends { _fieldIdentifier: infer C, _hasDefault: true, required: true } ? TypeFromIdentifier<C> | undefined
  : FD extends { _fieldIdentifier: infer C, required: true } ? TypeFromIdentifier<C>
  : FD extends { _fieldIdentifier: infer C } ? TypeFromIdentifier<C>
  : unknown

export type RecordPropsSchema<S> = UndefinedToOptional<{
  [K in keyof S]: PropsField<S[K]>
}>

export type RecordSchema<S> = UndefinedToOptional<{
  [K in keyof S]: RecordField<S[K]>
}>

export type RecordObject<S> = RecordSchema<S> & { _id?: string }