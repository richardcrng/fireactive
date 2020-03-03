import * as pluralize from 'pluralize'
import { RecordModel } from "../types/record.types";
import { RecordSchema } from '../types/schema.types';
import makeRecordConstructor from './constructor/makeRecordConstructor';
import addRecordStatics from './statics/addRecordStatics';
import addRecordInstances from './instances/addRecordInstances';

function modelRecord<Schema extends RecordSchema>(modelName: string, schema: Schema) {
  // our JavaScript `Record` variable, with a constructor type
  let Record: RecordModel<Schema>;

  const tableName = pluralize.plural(modelName)

  // Constructor function does not satisfy the whole `Record` type
  //  so it needs to be case to any
  Record = <any>makeRecordConstructor(modelName, schema);

  // adding static properties/methods onto `Record`
  // @ts-ignore : infinitely deep :(
  addRecordStatics(Record, { tableName })

  // adding instance methods and properties onto `Record.prototype`
  addRecordInstances(Record, { schema, tableName })

  return Record
}

export default modelRecord