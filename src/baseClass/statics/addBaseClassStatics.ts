import { BaseClass, ActiveRecord } from "../../types/class.types";
import { getFirebaseDatabase } from "../../initialize/initialize";
import { RecordSchema, ToCreateRecord } from "../../types/schema.types";

/**
 * Adds default class methods and properties onto the `BaseClass`
 */
const addBaseClassStatics = <Schema extends RecordSchema>(
  BaseClass: BaseClass<Schema>,
  scoped: { tableName: string }
): void => {
  
  BaseClass.create = async function (
    props: ToCreateRecord<Schema> & { _id?: string }
  ): Promise<ActiveRecord<Schema>> {
    const db = this.getDb()

    const record = new BaseClass({ ...props })
    const _id = record.getId()
    await db.ref(scoped.tableName).child(_id).set({ ...props, _id })
    return record
  }

  BaseClass.findById = async function(id: string): Promise<ActiveRecord<Schema>> {
    const db = this.getDb()

    const snapshot = await db.ref(scoped.tableName).child(id).once('value')
    const val = snapshot.val()
    return new this(val)
  }

  BaseClass.getDb = function () {
    const database = getFirebaseDatabase()
    if (!database) {
      throw new Error('Cannot get Firebase Real-Time Database instance: have you intialised the Firebase connection?')
    }

    return database
  }
}

export default addBaseClassStatics