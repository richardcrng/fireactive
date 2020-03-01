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

export type OnlyIfRequiredField<FTO> = FTO extends { optional: true }
  ? never
  : FTO

export type OnlyIfOptionalField<FTO> = OnlyIfRequiredField<FTO> extends never
  ? FTO
  : never

export type FieldType<T = any> = T extends PrimitiveConstructor ? T | FieldTypeOptions<T> : T

export interface SchemaShorthand {
  [key: string]: FieldType
}

export type SchemaLonghand<Shorthand extends SchemaShorthand> = {
  [K in keyof Shorthand]: Shorthand[K] extends FieldTypeOptions<infer T>
    ? Shorthand[K]
    : FieldTypeOptionsFromConstructor<Shorthand[K]>
}

export type SchemaRequired<Shorthand extends SchemaShorthand> = {
  [K in keyof SchemaLonghand<Shorthand>]: OnlyIfRequiredField<SchemaLonghand<Shorthand>[K]>
}

export type SchemaOptional<Shorthand extends SchemaShorthand> = {
  [K in keyof SchemaLonghand<Shorthand>]?: OnlyIfOptionalField<SchemaLonghand<Shorthand>[K]>
}

export type Schema<Shorthand extends SchemaShorthand> = SchemaRequired<Shorthand> & SchemaOptional<Shorthand>
