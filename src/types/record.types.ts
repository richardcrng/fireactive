import { UndefinedToOptional } from "./util.types"
import { CreateField, RecordField } from "./field.types"

/**
 * @template S - A Schema of Fields
 */
export type ToCreateRecord<S> = UndefinedToOptional<{
  [K in keyof S]: CreateField<S[K]>
}>

/**
 * @template S - A Schema of Fields
 */
export type RecordProps<S> = UndefinedToOptional<{
  [K in keyof S]: RecordField<S[K]>
}>

/**
 * @template S - A Schema of Fields
 */
export type RecordObject<S> = RecordProps<S> & { _id?: string }