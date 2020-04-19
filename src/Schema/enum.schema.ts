import { FieldOptions, FieldDefinition, FieldIdentifier } from "../types/field.types"


// Overloads for required with default: i.e. it exists on document but need not be passed in
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType> & { required: true, default: UnionType }
): FieldDefinition<UnionType[], true, true>
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]> & { optional: false, default: UnionType }
): FieldDefinition<UnionType[], true, true>;
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]> & { default: UnionType }
): FieldDefinition<UnionType[], true, true>;

// Overloads for required with no default: i.e. it exists on document and must be passed in
function enumr<UnionType extends string | number = string>(enumVals: readonly UnionType[],): FieldDefinition<UnionType[], true, false>
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]>
): FieldDefinition<UnionType[], true, false>
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]> & { required: true }
): FieldDefinition<UnionType[], true, false>
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]> & { optional: false }
): FieldDefinition<UnionType[], true, false>

// Overloads for optional wiwth default
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]> & { optional: true, default: UnionType }
): FieldDefinition<UnionType[], false, true>;
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]> & { required: false, default: UnionType }
): FieldDefinition<UnionType[], false, true>;

// Overloads for optional
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]> & { required: false }
): FieldDefinition<UnionType[], false>;
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]> & { optional: true }
): FieldDefinition<UnionType[], false>;

// General definition
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]> & { optional?: boolean, default?: UnionType }
): FieldDefinition<UnionType[]>
function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts: FieldOptions<UnionType[]> & { required?: boolean, default?: UnionType }
): FieldDefinition<UnionType[]>

function enumr<UnionType extends string | number = string>(
  enumVals: readonly UnionType[],
  opts?: FieldOptions<UnionType[]> & { required?: boolean, optional?: boolean, default?: UnionType }
): any {
  if (!opts) return { _fieldIdentifier: FieldIdentifier.enum, vals: enumVals, required: true }

  const { default: defaultVal, required, optional, ...rest } = opts

  // @ts-ignore
  let fieldConfig: FieldDefinition<UnionType[]> = { ...rest, _fieldIdentifier: FieldIdentifier.enum, vals: enumVals }

  if (typeof defaultVal !== 'undefined') {
    if (!enumVals.includes(defaultVal)) {
      throw new Error(`UnionTypehe supplied default value ${defaultVal} does not exist in the specifed enum, ${enumVals.join(' | ')}`)
    }
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

export default enumr