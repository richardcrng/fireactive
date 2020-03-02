import { FieldOptions, FieldConfiguration, FieldIdentifier } from "../types/schema.types"

// Overloads for required with default: i.e. it exists on document but need not be passed in
function number(opts: FieldOptions<number> & { required: true, default: number }): FieldConfiguration<number, true, boolean>;
function number(opts: FieldOptions<number> & { optional: false, default: number }): FieldConfiguration<number, true, boolean>;
function number(opts: FieldOptions<number> & { default: number }): FieldConfiguration<number, true, boolean>;

// Overloads for required with no default: i.e. it exists on document and must be passed in
function number(): FieldConfiguration<number, true, false>
function number(opts: FieldOptions<number> & { required: true }): FieldConfiguration<number, true, false>
function number(opts: FieldOptions<number> & { optional: false }): FieldConfiguration<number, true, false>

// Overloads for optional
function number(opts: FieldOptions<number> & { required: false }): FieldConfiguration<number, false>;
function number(opts: FieldOptions<number> & { optional: true }): FieldConfiguration<number, false>;

// General definition
function number(opts: FieldOptions<number> & { optional?: boolean, default?: number }): FieldConfiguration<number>
function number(opts: FieldOptions<number> & { required?: boolean, default?: number }): FieldConfiguration<number>

function number(opts?: FieldOptions<number> & { required?: boolean, optional?: boolean, default?: number }): any {
  if (!opts) return { _fieldIdentifier: FieldIdentifier.number, required: true }

  const { default: defaultVal, required, optional, ...rest } = opts

  // @ts-ignore
  let fieldConfig: FieldConfiguration<number> = { ...rest, _fieldIdentifier: FieldIdentifier.number }

  if (typeof defaultVal !== 'undefined') {
    fieldConfig._hasDefault = true
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

number.required = true
number._fieldIdentifier = FieldIdentifier.number

export default number