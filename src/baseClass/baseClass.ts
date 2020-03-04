import * as pluralize from 'pluralize'
import { RecordModel } from "../types/record.types";
import { RecordSchema } from '../types/schema.types';
import makeBaseClassConstructor from './constructor/makeBaseClassConstructor';
import addBaseClassStatics from './statics/addBaseClassStatics';
import addBaseClassInstances from './instances/addBaseClassInstances';

function baseClass<Schema extends RecordSchema>(className: string, schema: Schema) {
  // our JavaScript `Record` variable, with a constructor type
  let Record: RecordModel<Schema>;

  const tableName = pluralize.plural(className)

  // Constructor function does not satisfy the whole `Record` type
  //  so it needs to be case to any
  Record = <any>makeBaseClassConstructor(className, schema);

  // adding static properties/methods onto `Record`
  // @ts-ignore : infinitely deep :(
  addBaseClassStatics(Record, { tableName })

  // adding instance methods and properties onto `Record.prototype`
  addBaseClassInstances(Record, { schema, tableName })

  return Record
}

export default baseClass