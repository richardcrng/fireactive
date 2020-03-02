import { FieldOptions, FieldConfiguration, FieldIdentifier } from "../types/schema.types"

// Overloads for required
function string(opts?: FieldOptions<string> & { required: true }): FieldConfiguration<string, true>;
function string(opts?: FieldOptions<string> & { optional: false }): FieldConfiguration<string, true>;

// Overloads for optional
function string(opts?: FieldOptions<string> & { required: false }): FieldConfiguration<string, false>;
function string(opts?: FieldOptions<string> & { optional: true }): FieldConfiguration<string, false>;
function string(opts?: FieldOptions<string> & { default: string }): FieldConfiguration<string, false>;

// General definition
function string(opts?: FieldOptions<string> & { optional?: boolean, default?: string }): FieldConfiguration<string>
function string(opts?: FieldOptions<string> & { required?: boolean, default?: string }): FieldConfiguration<string>

function string(opts?: FieldOptions<string> & { required?: boolean, optional?: boolean, default?: string }): any {
  const schema = { ...opts, _fieldIdentifier: FieldIdentifier.string }

  if (opts?.required) {
    return { ...schema, required: true }
  } else if (opts?.optional) {
    return { ...schema, required: false }
  } else {
    return { ...schema, required: true }
  }
}
string.required = true
string._fieldIdentifier = FieldIdentifier.string

export default string