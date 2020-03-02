import { FieldOptions, FieldDefinition, FieldIdentifier } from "../types/field.types"

// Overloads for required with default: i.e. it exists on document but need not be passed in
function string(opts: FieldOptions<string> & { required: true, default: string }): FieldDefinition<string, true, true>;
function string(opts: FieldOptions<string> & { optional: false, default: string }): FieldDefinition<string, true, true>;
function string(opts: FieldOptions<string> & { default: string }): FieldDefinition<string, true, true>;

// Overloads for required with no default: i.e. it exists on document and must be passed in
function string(): FieldDefinition<string, true, false>
function string(opts: FieldOptions<string>): FieldDefinition<string, true, false>
function string(opts: FieldOptions<string> & { required: true }): FieldDefinition<string, true, false>
function string(opts: FieldOptions<string> & { optional: false }): FieldDefinition<string, true, false>

// Overloads for optional
function string(opts: FieldOptions<string> & { required: false }): FieldDefinition<string, false>;
function string(opts: FieldOptions<string> & { optional: true }): FieldDefinition<string, false>;

// General definition
function string(opts: FieldOptions<string> & { optional?: boolean, default?: string }): FieldDefinition<string>
function string(opts: FieldOptions<string> & { required?: boolean, default?: string }): FieldDefinition<string>

function string(opts?: FieldOptions<string> & { required?: boolean, optional?: boolean, default?: string }): any {
  if (!opts) return { _fieldIdentifier: FieldIdentifier.string, required: true }

  const { default: defaultVal, required, optional, ...rest } = opts

  // @ts-ignore
  let fieldConfig: FieldDefinition<string> = { ...rest, _fieldIdentifier: FieldIdentifier.string }

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