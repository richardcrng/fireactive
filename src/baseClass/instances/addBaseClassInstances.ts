import { BaseClass } from "../../types/class.types";
import { RecordSchema, ObjectFromRecord } from "../../types/schema.types";
import isNull from "../../utils/isNull";

/**
 * Adds default instance methods and properties onto the `BaseClass`'s prototype
 */
const addBaseClassInstances = <Schema extends RecordSchema>(
  BaseClass: BaseClass<Schema>,
  scoped: { schema: Schema, tableName: string }
): void => {

  BaseClass.prototype.getId = function(): string {
    if (this._id) {
      return this._id
    } else {
      const db = this.constructor.getDb()
      const newRef = db.ref(scoped.tableName).push()
      if (isNull(newRef.key)) {
        throw new Error('Failed to generate a new key, whoops')
      } else {
        this._id = newRef.key
        return this._id
      }
    }
  }



  BaseClass.prototype.save = async function(): Promise<void> {
    const db = this.constructor.getDb()
    await db.ref(scoped.tableName).child(this.getId()).set(this.toObject())
  };
  

  BaseClass.prototype.toObject = function(): ObjectFromRecord<Schema> {
    return [...Object.keys(scoped.schema), "_id"].reduce((acc, key) => {
      // @ts-ignore
      acc[key] = this[key]
      return acc
    }, {}) as ObjectFromRecord<Schema>
  }
}

export default addBaseClassInstances