import { FieldOptions, FieldDefinition, FieldIdentifier } from "../types/field.types"

// Overloads for required with default: i.e. it exists on document but need not be passed in
function boolean(opts: FieldOptions<boolean> & { required: true, default: boolean }): FieldDefinition<boolean, true, true>;
function boolean(opts: FieldOptions<boolean> & { optional: false, default: boolean }): FieldDefinition<boolean, true, true>;
function boolean(opts: FieldOptions<boolean> & { default: boolean }): FieldDefinition<boolean, true, true>;

// Overloads for required with no default: i.e. it exists on document and must be passed in
function boolean(): FieldDefinition<boolean, true, false>
function boolean(opts: FieldOptions<boolean>): FieldDefinition<boolean, true, false>
function boolean(opts: FieldOptions<boolean> & { required: true }): FieldDefinition<boolean, true, false>
function boolean(opts: FieldOptions<boolean> & { optional: false }): FieldDefinition<boolean, true, false>

// Overloads for optional
function boolean(opts: FieldOptions<boolean> & { required: false }): FieldDefinition<boolean, false>;
function boolean(opts: FieldOptions<boolean> & { optional: true }): FieldDefinition<boolean, false>;

// General definition
function boolean(opts: FieldOptions<boolean> & { optional?: boolean, default?: boolean }): FieldDefinition<boolean>
function boolean(opts: FieldOptions<boolean> & { required?: boolean, default?: boolean }): FieldDefinition<boolean>

function boolean(opts?: FieldOptions<boolean> & { required?: boolean, optional?: boolean, default?: boolean }): any {
  if (!opts) return { _fieldIdentifier: FieldIdentifier.boolean, required: true }

  const { default: defaultVal, required, optional, ...rest } = opts

  // @ts-ignore
  let fieldConfig: FieldDefinition<boolean> = { ...rest, _fieldIdentifier: FieldIdentifier.boolean }

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

boolean.required = true
boolean._fieldIdentifier = FieldIdentifier.boolean

export default boolean