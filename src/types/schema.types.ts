import { Primitive } from 'utility-types'

export type PrimitiveConstructor = StringConstructor | BooleanConstructor | NumberConstructor

export type Constructor<T extends Primitive | PrimitiveConstructor> = 
  T extends string ? StringConstructor
    : T extends number ? NumberConstructor
    : T extends boolean ? BooleanConstructor
    : T extends PrimitiveConstructor ? T
    : never

export type PrimitiveResolve<T> =
  T extends Primitive ? T
    : T extends BooleanConstructor ? boolean
    : T extends NumberConstructor ? number
    : T extends StringConstructor ? string
    : never

export type FieldTypeOptionsFromConstructor<PrimitiveConstructor> =
  PrimitiveConstructor extends StringConstructor ? FieldTypeOptions<string>
    : PrimitiveConstructor extends NumberConstructor ? FieldTypeOptions<number>
    : PrimitiveConstructor extends BooleanConstructor ? FieldTypeOptions<boolean>
    : never

export interface FieldTypeOptions<T extends Primitive | object> {
  type: FieldType<T>
  default?: PrimitiveResolve<T>,
  optional?: boolean
}

export type OnlyIfRequiredField<T> = T extends { optional: true }
  ? unknown
  : T extends { type: infer U } ? U : T

export type OnlyIfOptionalField<T> = T extends { type: infer U, optional: true }
  ? U
  : unknown

export type FieldType<T = any> = T extends PrimitiveConstructor ? T | FieldTypeOptions<T> : T

export interface SchemaShorthand {
  [key: string]: FieldType
}

export type SchemaLonghand<Shorthand extends SchemaShorthand> = {
  [K in keyof Shorthand]: Shorthand[K] extends FieldTypeOptions<infer T>
    ? Shorthand[K]
    : FieldTypeOptionsFromConstructor<Shorthand[K]>
}

export type RequiredFields<T extends {}> = {
  [K in keyof T]: OnlyIfRequiredField<T[K]>
}

const obj: Schema<{ foo: { optional: true, type: String }, bar: String }> = {
  foo: 'hello',
  bar: 'hi'
}

export type OptionalFields<T extends {}> = {
  [K in keyof T]?: OnlyIfOptionalField<T[K]>
}

export type Schema<T extends {}> = RequiredFields<T> & OptionalFields<T>
