import { ActiveClass } from "../../types/class.types";
import { RecordSchema, ObjectFromRecord } from "../../types/schema.types";
import isNull from "../../utils/isNull";
import { SyncOpts } from "../../types/sync.types";

/**
 * Adds default instance methods and properties onto the `ActiveClass`'s prototype
 */
const addActiveClassInstances = <Schema extends RecordSchema>(
  ActiveClass: ActiveClass<Schema>,
  scoped: { schema: Schema }
): void => {

  ActiveClass.prototype.getId = function(): string {
    if (this._id) {
      return this._id
    } else {
      const db = this.constructor.getDb()
      const newRef = db.ref(this.constructor.key).push()
      if (isNull(newRef.key)) {
        throw new Error('Failed to generate a new key, whoops')
      } else {
        return this._id = newRef.key
      }
    }
  }

  ActiveClass.prototype.reload = async function (): Promise<ObjectFromRecord<Schema>> {
    if (!this._id) throw new Error(`Can't reload a ${this.constructor.name} from the database without it having an id`)
    const snapshot = await this.ref().once('value')
    const vals = snapshot.val()
    Object.assign(this, vals)
    return vals
  };

  ActiveClass.prototype.ref = function(path?: string): firebase.database.Reference {
    const recordRef = this.constructor.ref(this.getId())
    return path
      ? recordRef.child(path)
      : recordRef
  }

  ActiveClass.prototype.save = async function(): Promise<ObjectFromRecord<Schema>> {
    const valsToSet = this.toObject()
    await this.ref().set(valsToSet)
    return valsToSet
  };

  ActiveClass.prototype.saveAndSync = async function(syncOpts?: SyncOpts): Promise<ObjectFromRecord<Schema>> {
    this.syncOpts({ fromDb: true, toDb: true, ...syncOpts })
    const setVals = await this.save()
    return setVals
  };

  ActiveClass.prototype.toObject = function(): ObjectFromRecord<Schema> {
    return [...Object.keys(scoped.schema), "_id"].reduce((acc, key) => {
      // @ts-ignore
      if (typeof this[key] !== 'undefined') acc[key] = this[key]
      return acc
    }, {}) as ObjectFromRecord<Schema>
  }
}

export default addActiveClassInstances