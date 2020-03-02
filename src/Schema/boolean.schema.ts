import { FieldOptions, FieldConfiguration, FieldIdentifier } from "../types/schema.types"

// Overloads for required with default
function boolean(opts?: FieldOptions<boolean> & { required: true, default: boolean }): FieldConfiguration<boolean, true, boolean>;
function boolean(opts?: FieldOptions<boolean> & { optional: false, default: boolean }): FieldConfiguration<boolean, true, boolean>;
function boolean(opts?: FieldOptions<boolean> & { default: boolean }): FieldConfiguration<boolean, true, boolean>;

// Overloads for optional
function boolean(opts?: FieldOptions<boolean> & { required: false }): FieldConfiguration<boolean, false>;
function boolean(opts?: FieldOptions<boolean> & { optional: true }): FieldConfiguration<boolean, false>;

// General definition
function boolean(opts?: FieldOptions<boolean> & { optional?: boolean, default?: boolean }): FieldConfiguration<boolean>
function boolean(opts?: FieldOptions<boolean> & { required?: boolean, default?: boolean }): FieldConfiguration<boolean>

function boolean(opts?: FieldOptions<boolean> & { required?: boolean, optional?: boolean, default?: boolean }): any {
  const schemaDef: FieldOptions<boolean> & {
    _fieldIdentifier: FieldIdentifier.boolean,
    _hasDefault?: boolean
  } = { ...opts, _fieldIdentifier: FieldIdentifier.boolean }

  if ((typeof opts?.default) !== 'undefined') {
    schemaDef._hasDefault = true
  }

  if (opts?.required) {
    return { ...schemaDef, required: true }
  } else if (opts?.optional) {
    return { ...schemaDef, required: false }
  } else {
    return { ...schemaDef, required: true }
  }
}

boolean.required = true
boolean._fieldIdentifier = FieldIdentifier.boolean

export default boolean