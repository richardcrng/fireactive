import { FieldOptions, FieldConfiguration, FieldIdentifier } from "../types/schema.types"

// Overloads for required with default: i.e. it exists on document but need not be passed in
function string(opts: FieldOptions<string> & { required: true, default: string }): FieldConfiguration<string, true, string>;
function string(opts: FieldOptions<string> & { optional: false, default: string }): FieldConfiguration<string, true, string>;
function string(opts: FieldOptions<string> & { default: string }): FieldConfiguration<string, true, string>;

// Overloads for required with no default: i.e. it exists on document and must be passed in
function string(): FieldConfiguration<string, true, false>
function string(opts: FieldOptions<string> & { required: true }): FieldConfiguration<string, true, false>
function string(opts: FieldOptions<string> & { optional: false }): FieldConfiguration<string, true, false>

// Overloads for optional
function string(opts: FieldOptions<string> & { required: false }): FieldConfiguration<string, false>;
function string(opts: FieldOptions<string> & { optional: true }): FieldConfiguration<string, false>;

// General definition
function string(opts: FieldOptions<string> & { optional?: string, default?: string }): FieldConfiguration<string>
function string(opts: FieldOptions<string> & { required?: string, default?: string }): FieldConfiguration<string>

function string(opts?: FieldOptions<string> & { required?: string, optional?: string, default?: string }): any {
  if (!opts) return { _fieldIdentifier: FieldIdentifier.string, required: true }

  const { default: defaultVal, required, optional, ...rest } = opts

  // @ts-ignore
  let fieldConfig: FieldConfiguration<string> = { ...rest, _fieldIdentifier: FieldIdentifier.string }

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

string.required = true
string._fieldIdentifier = FieldIdentifier.string

export default string