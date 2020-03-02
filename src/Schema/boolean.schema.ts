import { FieldOptions, FieldConfiguration, FieldIdentifier } from "../types/schema.types"

// Overloads for required
function boolean(opts?: FieldOptions<boolean> & { required: true }): FieldConfiguration<boolean, true>;
function boolean(opts?: FieldOptions<boolean> & { optional: false }): FieldConfiguration<boolean, true>;

// Overloads for optional
function boolean(opts?: FieldOptions<boolean> & { required: false }): FieldConfiguration<boolean, false>;
function boolean(opts?: FieldOptions<boolean> & { optional: true }): FieldConfiguration<boolean, false>;
function boolean(opts?: FieldOptions<boolean> & { default: boolean }): FieldConfiguration<boolean, false>;

// General definition
function boolean(opts?: FieldOptions<boolean> & { optional?: boolean, default?: boolean }): FieldConfiguration<boolean>
function boolean(opts?: FieldOptions<boolean> & { required?: boolean, default?: boolean }): FieldConfiguration<boolean>

function boolean(opts?: FieldOptions<boolean> & { required?: boolean, optional?: boolean, default?: boolean }): any {
  const schema = { ...opts, _fieldIdentifier: FieldIdentifier.boolean }

  if (opts?.required) {
    return { ...schema, required: true }
  } else if (opts?.optional) {
    return { ...schema, required: false }
  } else {
    return { ...schema, required: true }
  }
}

boolean.required = true
boolean._fieldIdentifier = FieldIdentifier.boolean

export default boolean