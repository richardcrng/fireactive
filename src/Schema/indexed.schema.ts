import { FieldIdentifier, IndexedFieldDefinition } from "../types/field.types"
import string from './string.schema';
import enumr from './enum.schema';
import boolean from './boolean.schema';
import number from './number.schema';

const indexString = (): IndexedFieldDefinition<string> => ({
  _fieldIdentifier: FieldIdentifier.indexed,
  indexed: string()
})
const indexedString = Object.assign(indexString, indexString())

const indexedEnum = <T extends string | number = string>(
  enumVals: readonly T[]
): IndexedFieldDefinition<T[]> => ({
  _fieldIdentifier: FieldIdentifier.indexed,
  indexed: enumr(enumVals)
})

const indexBoolean = (): IndexedFieldDefinition<boolean> => ({
  _fieldIdentifier: FieldIdentifier.indexed,
  indexed: boolean()
})
const indexedBoolean = Object.assign(indexBoolean, indexBoolean())

const indexNumber = (): IndexedFieldDefinition<number> => ({
  _fieldIdentifier: FieldIdentifier.indexed,
  indexed: number()
})
const indexedNumber = Object.assign(indexNumber, indexNumber())

const indexTrue = (): IndexedFieldDefinition<true> => ({
  _fieldIdentifier: FieldIdentifier.indexed,
  indexed: {
    _fieldIdentifier: FieldIdentifier.true,
    _hasDefault: true,
    required: true
  }
})
const indexedTrue = Object.assign(indexTrue, indexTrue())

const indexed = {
  _fieldIdentifier: FieldIdentifier.indexed,
  string: indexedString,
  boolean: indexedBoolean,
  number: indexedNumber,
  enum: indexedEnum,
  true: indexedTrue
}

export default indexed