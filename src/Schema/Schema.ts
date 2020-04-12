import number from "./number.schema"
import string from "./string.schema"
import boolean from './boolean.schema';
import enumr from './enum.schema';
import indexed from './indexed.schema';

// enum is a reserved keyword in TS
// so some renaming is required

const Schema = {
  string,
  number,
  boolean,
  enum: enumr,
  indexed
}

export {
  number,
  string,
  boolean,
  enumr as enum,
  indexed
}

export default Schema