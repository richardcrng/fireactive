import { whereEq } from 'ramda'
import { BaseClass, ActiveRecord } from "../../types/class.types";
import { getFirebaseDatabase } from "../../initialize/initialize";
import { RecordSchema, ToCreateRecord, ObjectFromRecord } from "../../types/schema.types";

/**
 * Adds default class methods and properties onto the `BaseClass`
 */
const addBaseClassStatics = <Schema extends RecordSchema>(
  BaseClass: BaseClass<Schema>
): void => {
  
  BaseClass.create = async function (
    props: ToCreateRecord<Schema> & { _id?: string }
  ): Promise<ActiveRecord<Schema>> {
    const db = this.getDb()

    const record = new this({ ...props })
    const _id = record.getId()
    await db.ref(this.key).child(_id).set({ ...props, _id })
    return record
  }

  BaseClass.find = async function(props: Partial<ObjectFromRecord<Schema>>): Promise<ActiveRecord<Schema>[]> {
    const db = this.getDb()
    const tableSnapshot = await db.ref(this.key).once('value')
    const tableVal = tableSnapshot.val()
    const tableValues = Object.values(tableVal)

    // @ts-ignore
    const matchingVals: ObjectFromRecord<Schema>[] = tableValues.filter(record => {
      return whereEq(props, record)
    })

    // @ts-ignore
    return matchingVals.map(props => new this(props))
  }

  BaseClass.findById = async function(id: string): Promise<ActiveRecord<Schema>> {
    const db = this.getDb()

    const snapshotAtId = await db.ref(this.key).child(id).once('value')
    const valAtId = snapshotAtId.val()
    const player = new this(valAtId)
    return player
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