import { UndefinedToOptional } from "../types/util.types"
import { TypedSchema } from '../types/schema.types'
import number from "./number.schema"
import string from "./string.schema"
import boolean from './boolean.schema';

const schema = {
  name: string(),
  isHost: boolean(),
  age: number
}

type MyType = TypedSchema<typeof schema>

const myType: MyType = {
  name: 'hello',
  age: 5
}
