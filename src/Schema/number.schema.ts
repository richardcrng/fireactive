import { FieldOptions, FieldConfiguration, FieldIdentifier } from "../types/schema.types"

// Overloads for required
function number(opts?: FieldOptions<number> & { required: true }): FieldConfiguration<number, true>;

// Overloads for optional
function number(opts?: FieldOptions<number> & { required: false }): FieldConfiguration<number, false>;
function number(opts?: FieldOptions<number> & { default: number }): FieldConfiguration<number, false>;

// General definition
function number(opts?: FieldOptions<number>): FieldConfiguration<number>

function number(opts?: FieldOptions<number> & { required?: boolean, default?: number }): any {
  if (opts?.required) {
    return {
      ...opts,
      _fieldIdentifier: FieldIdentifier.number
    }
  }
}
number.required = true
number._fieldIdentifier = FieldIdentifier.number

export default number