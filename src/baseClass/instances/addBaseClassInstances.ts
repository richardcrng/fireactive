import { BaseClass, ActiveRecord } from "../../types/class.types";
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

  BaseClass.prototype.reload = async function (): Promise<ObjectFromRecord<Schema>> {
    if (!this._id) throw new Error(`Can't reload a ${this.constructor.name} from the database without it having an id`)
    const db = this.constructor.getDb()
    const snapshot = await db.ref(this.constructor.key).child(this._id).once('value')
    const vals = snapshot.val()
    Object.assign(this, vals)
    return vals
  };

  BaseClass.prototype.ref = function(path?: string): firebase.database.Reference {
    const recordRef = this.constructor.ref(this.getId())
    return path
      ? recordRef.child(path)
      : recordRef
  }

  BaseClass.prototype.save = async function(): Promise<ObjectFromRecord<Schema>> {
    const db = this.constructor.getDb()
    const valsToSet = this.toObject()
    await db.ref(scoped.tableName).child(this.getId()).set(valsToSet)
    return valsToSet
  };

  BaseClass.prototype.saveAndSync = async function (): Promise<ObjectFromRecord<Schema>> {
    const setVals = this.save()
    this.syncOpts({ fromDb: true, toDb: true })
    return setVals
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