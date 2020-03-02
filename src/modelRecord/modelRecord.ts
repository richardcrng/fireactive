import * as pluralize from 'pluralize'
import { RecordSchema, RecordModel, ActiveRecord, ToCreateRecord, ObjectFromRecord } from "../types/record.types";
import { FieldIdentifier } from '../types/field.types';
import { getFirebaseDatabase } from '../initialize/initialize';
import makeRecordConstructor from './makeRecordConstructor';

function modelRecord<Schema extends RecordSchema>(modelName: string, schema: Schema) {
  // our JavaScript `Record` variable, with a constructor type
  let Record: RecordModel<Schema>;

  const tableName = pluralize.plural(modelName)

  // `Function` does not fulfill the defined type so
  // it needs to be cast to <any>
  Record = <any>makeRecordConstructor(modelName, schema);

  // static properties/methods go on the JavaScript variable...
  Record.create = async function (
    props: ToCreateRecord<Schema> & { _id?: string }
  ): Promise<ActiveRecord<Schema>> {
    const db = this.getDb()

    let _id: string
    if (props._id) {
      _id = props._id
    } else {
      const ref = await db.ref(tableName).push()
      _id = ref.key as string
    }
    // @ts-ignore
    const record = new Record({ ...props, _id })
    await db.ref(tableName).child(_id).set({ ...props, _id })
    return record
  };

  Record.getDb = function () {
    const database = getFirebaseDatabase()
    if (!database) {
      throw new Error('Cannot get Firebase Real-Time Database instance: have you intialised the Firebase connection?')
    }

    return database
  }

  // instance methods and properties
  Record.prototype.save = async function (): Promise<void> {
    const db = this.constructor.getDb()
    if (this._id) {
      await db.ref(tableName).child(this._id).set(this.toObject())
    }
  };

  Record.prototype.toObject = function (): ObjectFromRecord<Schema> {
    return [...Object.keys(schema), "_id"].reduce((acc, key) => {
      // @ts-ignore
      acc[key] = this[key]
      return acc
    }, {}) as ObjectFromRecord<Schema>
  }

  return Record
}

export default modelRecord