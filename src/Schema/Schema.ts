import number from "./number.schema"
import string from "./string.schema"
import boolean from './boolean.schema';
import enumr from './enum.schema';

const Schema = {
  string,
  number,
  boolean,
  enum: enumr,
  enumr
}

export {
  number,
  string,
  boolean,
  enumr,
  enumr as enum
}

export default Schema