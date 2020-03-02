import { RecordModel } from "../../types/record.types";
import { RecordSchema, ObjectFromRecord } from "../../types/schema.types";

/**
 * Adds instance methods and properties onto the Record's prototype
 */
const addRecordInstances = <Schema extends RecordSchema>(
  Record: RecordModel<Schema>,
  scoped: { schema: Schema, tableName: string }
) => {
  Record.prototype.save = async function (): Promise<void> {
    const db = this.constructor.getDb()
    if (this._id) {
      await db.ref(scoped.tableName).child(this._id).set(this.toObject())
    }
  };

  Record.prototype.toObject = function (): ObjectFromRecord<Schema> {
    return [...Object.keys(scoped.schema), "_id"].reduce((acc, key) => {
      // @ts-ignore
      acc[key] = this[key]
      return acc
    }, {}) as ObjectFromRecord<Schema>
  }
}

export default addRecordInstances