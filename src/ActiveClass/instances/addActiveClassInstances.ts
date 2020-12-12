import { ActiveClass } from "../../types/class.types";
import { DocumentSchema, ObjectFromDocument } from "../../types/schema.types";
import isNull from "../../utils/isNull";
import { SyncOpts } from "../../types/sync.types";
import ActiveClassError from "../Error";

/**
 * Adds default instance methods and properties onto the `ActiveClass`'s prototype
 */
const addActiveClassInstances = <Schema extends DocumentSchema>(
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

  ActiveClass.prototype.off = function(eventType, callback) {
    return this.off(eventType, callback)
  }

  ActiveClass.prototype.on = function(eventType, callback) {
    return this.on(eventType, callback)
  }

  ActiveClass.prototype.reload = async function (): Promise<ObjectFromDocument<Schema>> {
    if (!this._id) throw new Error(`Can't reload a ${this.constructor.name} from the database without it having an id`)
    const snapshot = await this.ref().once('value')
    const vals = snapshot.val()
    Object.assign(this, vals)
    return vals
  };

  ActiveClass.prototype.ref = function(path?: string): firebase.database.Reference {
    const documentRef = this.constructor.ref(this.getId())
    return path
      ? documentRef.child(path)
      : documentRef
  }

  ActiveClass.prototype.save = async function(): Promise<ObjectFromDocument<Schema>> {
    const valsToSet = this.toObject()
    try {
      await this.ref().set(valsToSet)
      return valsToSet
    } catch (err) {
      throw ActiveClassError.from(err, { what: `Failed to save ${this.constructor.name} into database` })
    }
  };

  ActiveClass.prototype.saveAndSync = async function(syncOpts?: SyncOpts): Promise<ObjectFromDocument<Schema>> {
    this.syncOpts({ fromDb: true, toDb: true, ...syncOpts })
    const setVals = await this.save()
    return setVals
  };

  ActiveClass.prototype.toObject = function(): ObjectFromDocument<Schema> {
    return [...Object.keys(scoped.schema), "_id"].reduce((acc, key) => {
      // @ts-ignore
      if (typeof this[key] !== 'undefined') acc[key] = this[key]
      return acc
    }, {}) as ObjectFromDocument<Schema>
  }
}

export default addActiveClassInstances