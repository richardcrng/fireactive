import { FieldOptions, FieldConfiguration, FieldIdentifier } from "../types/schema.types"

// Overloads for required
function boolean(opts?: FieldOptions<boolean> & { required: true }): FieldConfiguration<boolean, true>;

// Overloads for optional
function boolean(opts?: FieldOptions<boolean> & { required: false }): FieldConfiguration<boolean, false>;
function boolean(opts?: FieldOptions<boolean> & { default: boolean }): FieldConfiguration<boolean, false>;

// General definition
function boolean(opts?: FieldOptions<boolean>): FieldConfiguration<boolean>

function boolean(opts?: FieldOptions<boolean> & { required?: boolean, default?: boolean }): any {
  if (opts?.required) {
    return {
      ...opts,
      required: true,
      _fieldIdentifier: FieldIdentifier.boolean
    }
  } else {
    return {
      ...opts,
      required: false,
      _fieldIdentifier: FieldIdentifier.boolean
    }
  }
}
boolean.required = true
boolean._fieldIdentifier = FieldIdentifier.boolean

export default boolean