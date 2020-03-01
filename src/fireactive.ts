import * as firebase from 'firebase'
import dotenv from 'dotenv'
import { FirebaseConfig } from './types/firebase.types'
import { UndefinedToOptional } from './types/util.types'

dotenv.config()

const config: FirebaseConfig = {
  apiKey: process.env.API_KEY as string,
  authDomain: process.env.AUTH_DOMAIN as string,
  databaseURL: process.env.DATABASE_URL as string,
  projectId: process.env.PROJECT_ID as string,
  storageBucket: process.env.STORAGE_BUCKET as string,
  messagingSenderId: process.env.MESSAGING_SENDER_ID as string
}

const app = firebase.initializeApp(config)
const db = firebase.database()

type Entity<T> = Schema<T> & {
  save(): void
}

interface FieldOptions<T> {
  default?: T,
}

type FieldConstructor<T = any> = (opts?: FieldOptions<T>) => void

type FieldFunction<Identifier = any> = Identifier extends string ? FieldConstructor<string> & { _fieldIdentifier: FieldIdentifier.String }
  : Identifier extends number ? FieldConstructor<number> & { _fieldIdentifier: FieldIdentifier.Number }
  : Identifier extends boolean ? FieldConstructor<boolean> & { _fieldIdentifier: FieldIdentifier.Boolean }
  : FieldConstructor & FieldIdentifier

type FieldConfiguration<T = any, R extends boolean = boolean> = FieldOptions<T> & {
  _fieldIdentifier: T extends string ? FieldIdentifier.String
    : T extends number ? FieldIdentifier.Number
    : T extends boolean ? FieldIdentifier.Boolean
    : unknown
} & {
  required: R
}

type FieldDefinition = FieldFunction | FieldConfiguration

export enum FieldIdentifier {
  String = 'FIELD_TYPE_STRING',
  Number = 'FIELD_TYPE_NUMBER',
  Boolean = 'FIELD_TYPE_BOOLEAN'
}

export const FIELD_IDENTIFIERS = {
  String: FieldIdentifier.String,
  Number: FieldIdentifier.Number,
  Boolean: FieldIdentifier.Boolean
}

type TypeFromIdentifier<T> =
  T extends 'FIELD_TYPE_STRING' ? string
  : T extends 'FIELD_TYPE_NUMBER' ? number
  : T extends 'FIELD_TYPE_BOOLEAN' ? boolean
    : unknown

function string(opts?: FieldOptions<string>) {
  return {
    ...opts,
    _fieldIdentifier: FieldIdentifier.String
  }
}

// function number(opts?: FieldOptions<number>) {
//   return {
//     ...opts,
//     _fieldIdentifier: FieldIdentifier.Number
//   }
// }

function boolean(opts?: FieldOptions<boolean>) {
  return {
    ...opts,
    _fieldIdentifier: FieldIdentifier.Boolean
  }
}

export const Types = {
  string,
  number,
  boolean
}

function number(opts?: FieldOptions<number> & { required: true }): FieldConfiguration<number, true>;
function number(opts?: FieldOptions<number> & { required: false }): FieldConfiguration<number, false>;
function number(opts?: FieldOptions<number>): FieldConfiguration<number>

function number(opts?: FieldOptions<number> & { required?: boolean }): any {
  if (opts?.required) {
    return {
      ...opts,
      _fieldIdentifier: FieldIdentifier.Number
    }
  }
}

export interface Schema {
  [key: string]: FieldDefinition
}

type FieldType<FD> =
  FD extends { _fieldIdentifier: infer C, required: false } ? TypeFromIdentifier<C> | undefined
    : FD extends { _fieldIdentifier: infer C, required: true } ? TypeFromIdentifier<C>
    : FD extends { _fieldIdentifier: infer C } ? TypeFromIdentifier<C>
    : unknown 

type TypedSchema<S> = UndefinedToOptional<{
  [K in keyof S]: FieldType<S[K]>
}>


const schema = {
  name: Types.string(),
  isHost: Types.boolean(),
  age: Types.number()
}

type MyType = TypedSchema<typeof schema>

const myType: MyType = {
  name: 'hello',
  isHost: true,
}

interface Foo {
  a: boolean,
  b?: string,
  c?: number,
}

interface Bar {
  c: number,
  d: boolean
}

const foobar: Foo & Bar = {
  a: true,
  c: 6,
  d: true,
}

export function createORM(tableName: string, schema: Schema) {


  const createNewEntity = (props: Schema<SchemaShorthand>): Entity<typeof schemaLonghand> => {
    return {
      ...props,
      save: () => console.log('saving')
    }
  }

  return {
    new: createNewEntity
  }
}
