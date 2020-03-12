import { FieldOptions, FieldDefinition, FieldIdentifier } from "../types/field.types"

// Overloads for required with default: i.e. it exists on document but need not be passed in
function numberFn(opts: FieldOptions<number> & { required: true, default: number }): FieldDefinition<number, true, true>;
function numberFn(opts: FieldOptions<number> & { optional: false, default: number }): FieldDefinition<number, true, true>;
function numberFn(opts: FieldOptions<number> & { default: number }): FieldDefinition<number, true, true>;

// Overloads for required with no default: i.e. it exists on document and must be passed in
function numberFn(): FieldDefinition<number, true, false>
function numberFn(opts: FieldOptions<number>): FieldDefinition<number, true, false>
function numberFn(opts: FieldOptions<number> & { required: true }): FieldDefinition<number, true, false>
function numberFn(opts: FieldOptions<number> & { optional: false }): FieldDefinition<number, true, false>

// Overloads for optional
function numberFn(opts: FieldOptions<number> & { required: false }): FieldDefinition<number, false>;
function numberFn(opts: FieldOptions<number> & { optional: true }): FieldDefinition<number, false>;

// General definition
function numberFn(opts: FieldOptions<number> & { optional?: boolean, default?: number }): FieldDefinition<number>
function numberFn(opts: FieldOptions<number> & { required?: boolean, default?: number }): FieldDefinition<number>

function numberFn(opts?: FieldOptions<number> & { required?: boolean, optional?: boolean, default?: number }): any {
  if (!opts) return { _fieldIdentifier: FieldIdentifier.number, required: true }

  const { default: defaultVal, required, optional, ...rest } = opts

  // @ts-ignore
  let fieldConfig: FieldDefinition<number> = { ...rest, _fieldIdentifier: FieldIdentifier.number }

  if (typeof defaultVal !== 'undefined') {
    fieldConfig._hasDefault = true
    fieldConfig.default = defaultVal
  } else {
    fieldConfig._hasDefault = false
  }

  if (optional || required === false) {
    fieldConfig.required = false
  } else {
    fieldConfig.required = true
  }

  return fieldConfig
}

const number = Object.assign(numberFn, numberFn())

export default number