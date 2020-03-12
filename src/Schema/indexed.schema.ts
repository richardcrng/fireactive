import { FieldDefinition, FieldIdentifier, IndexedFieldDefinition } from "../types/field.types"
import { SchemaProperty } from "../types/schema.types"
import string from './string.schema';
import enumr from './enum.schema';
import boolean from './boolean.schema';
import number from './number.schema';

const indexedString = (): IndexedFieldDefinition<string> => ({
  _fieldIdentifier: FieldIdentifier.indexed,
  indexed: string()
})
// indexedString._fieldIdentifier = FieldIdentifier.indexed
// indexedString.indexed = string()
// indexedString.required = true

const indexedEnum = <T extends string | number = string>(
  enumVals: readonly T[]
): IndexedFieldDefinition<T[]> => ({
  _fieldIdentifier: FieldIdentifier.indexed,
  indexed: enumr(enumVals)
})

const indexedBoolean = (): IndexedFieldDefinition<boolean> => ({
  _fieldIdentifier: FieldIdentifier.indexed,
  indexed: boolean()
})
// indexedBoolean._fieldIdentifier = FieldIdentifier.indexed
// indexedBoolean.indexed = boolean()
// indexedBoolean.required = true

const indexedNumber = (): IndexedFieldDefinition<number> => ({
  _fieldIdentifier: FieldIdentifier.indexed,
  indexed: number()
})
// indexedNumber._fieldIdentifier = FieldIdentifier.indexed
// indexedNumber.indexed = number()
// indexedNumber.required = true

const indexed = {
  _fieldIdentifier: FieldIdentifier.indexed,
  string: indexedString,
  boolean: indexedBoolean,
  number: indexedNumber,
  enumr: indexedEnum,
  enum: indexedEnum
}

// function indexed(schemaProperty: FieldDefinition): FieldDefinition<{ [key: string]: FieldDefinition }, true, false> {
  
//   // @ts-ignore
//   let fieldConfig: FieldDefinition<{ [key: string]: FieldDefinition }, true, false> = {
//     _fieldIdentifier: FieldIdentifier.indexed,
//     indexed: schemaProperty,
//     required: true
//   }

//   // if (typeof defaultVal !== 'undefined') {
//   //   fieldConfig._hasDefault = true
//   //   fieldConfig.default = defaultVal
//   // } else {
//   //   fieldConfig._hasDefault = false
//   // }

//   // if (optional || required === false) {
//   //   fieldConfig.required = false
//   // } else {
//   //   fieldConfig.required = true
//   // }

//   return fieldConfig
// }

export default indexed