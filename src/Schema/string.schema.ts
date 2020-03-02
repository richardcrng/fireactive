import { FieldOptions, FieldConfiguration, FieldIdentifier } from "../types/schema.types"

// Overloads for required
function string(opts?: FieldOptions<string> & { required: true }): FieldConfiguration<string, true>;

// Overloads for optional
function string(opts?: FieldOptions<string> & { required: false }): FieldConfiguration<string, false>;
function string(opts?: FieldOptions<string> & { default: string }): FieldConfiguration<string, false>;

// General definition
function string(opts?: FieldOptions<string>): FieldConfiguration<string>

function string(opts?: FieldOptions<string> & { required?: boolean, default?: string }): any {
  if (opts?.required) {
    return {
      ...opts,
      _fieldIdentifier: FieldIdentifier.string
    }
  }
}
string.required = true
string._fieldIdentifier = FieldIdentifier.string

export default string