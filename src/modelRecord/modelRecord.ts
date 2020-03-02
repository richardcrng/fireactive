import * as pluralize from 'pluralize'
import { RecordSchema, RecordModel } from "../types/record.types";
import makeRecordConstructor from './makeRecordConstructor';
import addRecordStatics from './statics/addRecordStatics';
import addRecordInstances from './instances/addRecordInstances';

function modelRecord<Schema extends RecordSchema>(modelName: string, schema: Schema) {
  // our JavaScript `Record` variable, with a constructor type
  let Record: RecordModel<Schema>;

  const tableName = pluralize.plural(modelName)

  // `Function` does not fulfill the defined type so
  // it needs to be cast to <any>
  Record = <any>makeRecordConstructor(modelName, schema);

  // static properties/methods go on the JavaScript variable...
  addRecordStatics(Record, { tableName })

  // instance methods and properties
  addRecordInstances(Record, { schema, tableName })

  return Record
}

export default modelRecord