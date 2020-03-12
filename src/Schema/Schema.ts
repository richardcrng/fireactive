import number from "./number.schema"
import string from "./string.schema"
import boolean from './boolean.schema';
import enumr from './enum.schema';
import indexed from './indexed.schema';

// export enumr as both enum and enumr
// because enum is a reserved keyword in enum
//  -> allow both Schema.enum and also destructuring enumr

const Schema = {
  string,
  number,
  boolean,
  enum: enumr,
  enumr,
  indexed
}

export {
  number,
  string,
  boolean,
  enumr,
  enumr as enum,
  indexed
}

export default Schema