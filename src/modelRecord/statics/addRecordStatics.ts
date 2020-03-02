import { RecordModel, ActiveRecord } from "../../types/record.types";
import { getFirebaseDatabase } from "../../initialize/initialize";
import { RecordSchema, ToCreateRecord } from "../../types/schema.types";

/**
 * Adds class methods and properties onto the class
 */
const addRecordStatics = <Schema extends RecordSchema>(
  Record: RecordModel<Schema>,
  scoped: { tableName: string }
): void => {
  Record.create = async function (
    props: ToCreateRecord<Schema> & { _id?: string }
  ): Promise<ActiveRecord<Schema>> {
    const db = this.getDb()

    let _id: string
    if (props._id) {
      _id = props._id
    } else {
      const ref = db.ref(scoped.tableName).push()
      _id = ref.key as string
    }
    const record = new Record({ ...props, _id })
    await db.ref(scoped.tableName).child(_id).set({ ...props, _id })
    return record
  };

  Record.getDb = function () {
    const database = getFirebaseDatabase()
    if (!database) {
      throw new Error('Cannot get Firebase Real-Time Database instance: have you intialised the Firebase connection?')
    }

    return database
  }
}

export default addRecordStatics