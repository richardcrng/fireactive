import { UndefinedToOptional } from "./util.types"

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
  required: R,
  default?: T
} & (D extends true ? { _hasDefault: true } : { _hasDefault: false })

export type FieldType<FI> = FI extends FieldIdentifier.boolean ? boolean
  : FI extends boolean ? boolean
  : FI extends FieldIdentifier.number ? number
  : FI extends number ? number
  : FI extends FieldIdentifier.string ? string
  : FI extends string ? string
  : unknown

export enum FieldIdentifier {
  string = 'STRING_FIELD_IDENTIFIER',
  number = 'NUMBER_FIELD_IDENTIFIER',
  boolean = 'BOOLEAN_FIELD_IDENTIFIER'
}

export type TypeFromIdentifier<T> =
  T extends FieldIdentifier.string ? string
  : T extends FieldIdentifier.number ? number
  : T extends FieldIdentifier.boolean ? boolean
  : unknown

/**
 * Converts a FieldDefinition to a value that the record holds
 */
export type RecordField<FD> =
  // if FD.required === false, then the record might not have the property
  FD extends { _fieldIdentifier: infer C, required: false } ? TypeFromIdentifier<C> | undefined
    // else if it has `_fieldIdentifier`, then it is a necessary primitive field
    : FD extends { _fieldIdentifier: infer C } ? TypeFromIdentifier<C>
    // else it is an object of RecordFields, some of which might be optional
    : FD extends {} ? UndefinedToOptional<{ [K in keyof FD]: RecordField<FD[K]> }>
    // 🤷
    : unknown

/**
 * Converts a FieldDefinition to a value taken by the record on initialisation
 */
export type CreateField<FD> =
  // if FD._hasDefault === true, then field does not need to be supplied at creation
  FD extends { _fieldIdentifier: infer C, _hasDefault: true } ? TypeFromIdentifier<C> | undefined
    // if FD.required === false, then field does not need to be supplied at creation
    : FD extends { _fieldIdentifier: infer C, required: false } ? TypeFromIdentifier<C> | undefined
    // else if it's a primitive field, then it does need to be supplied at creation
    : FD extends { _fieldIdentifier: infer C } ? TypeFromIdentifier<C>
    // if not a primitive field, it's probably an object of other fields
    : FD extends {} ? UndefinedToOptional<{ [K in keyof FD]: CreateField<FD[K]> }>
    // 🤷
    : unknown