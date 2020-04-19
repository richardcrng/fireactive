import { FieldOptions, FieldDefinition, FieldIdentifier } from "../types/field.types"

// Overloads for required with default: i.e. it exists on document but need not be passed in
function stringFn(opts: FieldOptions<string> & { required: true, default: string }): FieldDefinition<string, true, true>;
function stringFn(opts: FieldOptions<string> & { optional: false, default: string }): FieldDefinition<string, true, true>;
function stringFn(opts: FieldOptions<string> & { default: string }): FieldDefinition<string, true, true>;

// Overloads for required with no default: i.e. it exists on document and must be passed in
function stringFn(): FieldDefinition<string, true, false>
function stringFn(opts: FieldOptions<string>): FieldDefinition<string, true, false>
function stringFn(opts: FieldOptions<string> & { required: true }): FieldDefinition<string, true, false>
function stringFn(opts: FieldOptions<string> & { optional: false }): FieldDefinition<string, true, false>

// Overloads for optional wiwth default
function stringFn(opts: FieldOptions<string> & { optional: true, default: string }): FieldDefinition<string, false, true>;
function stringFn(opts: FieldOptions<string> & { required: false, default: string }): FieldDefinition<string, false, true>;

// Overloads for optional
function stringFn(opts: FieldOptions<string> & { required: false }): FieldDefinition<string, false>;
function stringFn(opts: FieldOptions<string> & { optional: true }): FieldDefinition<string, false>;

// General definition
function stringFn(opts: FieldOptions<string> & { optional?: boolean, default?: string }): FieldDefinition<string>
function stringFn(opts: FieldOptions<string> & { required?: boolean, default?: string }): FieldDefinition<string>

function stringFn(opts?: FieldOptions<string> & { required?: boolean, optional?: boolean, default?: string }): any {
  if (!opts) return { _fieldIdentifier: FieldIdentifier.string, required: true }

  const { default: defaultVal, required, optional, ...rest } = opts

  // @ts-ignore
  let fieldConfig: FieldDefinition<string> = { ...rest, _fieldIdentifier: FieldIdentifier.string }

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

const string = Object.assign(stringFn, stringFn())

export default string