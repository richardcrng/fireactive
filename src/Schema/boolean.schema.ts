import { FieldOptions, FieldConfiguration, FieldIdentifier } from "../types/schema.types"

// Overloads for required with default: i.e. it exists on document but need not be passed in
function boolean(opts: FieldOptions<boolean> & { required: true, default: boolean }): FieldConfiguration<boolean, true, boolean>;
function boolean(opts: FieldOptions<boolean> & { optional: false, default: boolean }): FieldConfiguration<boolean, true, boolean>;
function boolean(opts: FieldOptions<boolean> & { default: boolean }): FieldConfiguration<boolean, true, boolean>;

// Overloads for required with no default: i.e. it exists on document and must be passed in
function boolean(): FieldConfiguration<boolean, true, false>
function boolean(opts: FieldOptions<boolean> & { required: true }): FieldConfiguration<boolean, true, false>
function boolean(opts: FieldOptions<boolean> & { optional: false }): FieldConfiguration<boolean, true, false>

// Overloads for optional
function boolean(opts: FieldOptions<boolean> & { required: false }): FieldConfiguration<boolean, false>;
function boolean(opts: FieldOptions<boolean> & { optional: true }): FieldConfiguration<boolean, false>;

// General definition
function boolean(opts: FieldOptions<boolean> & { optional?: boolean, default?: boolean }): FieldConfiguration<boolean>
function boolean(opts: FieldOptions<boolean> & { required?: boolean, default?: boolean }): FieldConfiguration<boolean>

function boolean(opts?: FieldOptions<boolean> & { required?: boolean, optional?: boolean, default?: boolean }): any {
  if (!opts) return { _fieldIdentifier: FieldIdentifier.boolean, required: true }

  const { default: defaultVal, required, optional, ...rest } = opts

  // @ts-ignore
  let fieldConfig: FieldConfiguration<boolean> = { ...rest, _fieldIdentifier: FieldIdentifier.boolean }

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

boolean.required = true
boolean._fieldIdentifier = FieldIdentifier.boolean

export default boolean