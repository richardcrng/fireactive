import { FieldOptions, FieldConfiguration, FieldIdentifier } from "../types/schema.types"

// Overloads for required
function number(opts?: FieldOptions<number> & { required: true }): FieldConfiguration<number, true>;
function number(opts?: FieldOptions<number> & { optional: false }): FieldConfiguration<number, true>;

// Overloads for optional
function number(opts?: FieldOptions<number> & { required: false }): FieldConfiguration<number, false>;
function number(opts?: FieldOptions<number> & { optional: true }): FieldConfiguration<number, false>;
function number(opts?: FieldOptions<number> & { default: number }): FieldConfiguration<number, false>;

// General definition
function number(opts?: FieldOptions<number> & { optional?: boolean, default?: number }): FieldConfiguration<number>
function number(opts?: FieldOptions<number> & { required?: boolean, default?: number }): FieldConfiguration<number>

function number(opts?: FieldOptions<number> & { required?: boolean, optional?: boolean, default?: number }): any {
  const schema = { ...opts, _fieldIdentifier: FieldIdentifier.number }

  if (opts?.required) {
    return { ...schema, required: true }
  } else if (opts?.optional) {
    return { ...schema, required: false }
  } else {
    return { ...schema, required: true }
  }
}
number.required = true
number._fieldIdentifier = FieldIdentifier.number

export default number