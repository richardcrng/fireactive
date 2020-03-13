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

  // helpers
  async function getTableVals(): Promise<ObjectFromRecord<Schema>[]> {
    const db = BaseClass.getDb()
    const tableSnapshot = await db.ref(BaseClass.key).once('value')
    const tableVal = tableSnapshot.val()
    const tableValues: ObjectFromRecord<Schema>[] = Object.values(tableVal)
    return tableValues
  }



  // main
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
    const tableValues = await getTableVals()

    // @ts-ignore
    const matchingVals: ObjectFromRecord<Schema>[] = tableValues.filter(record => {
      return whereEq(props, record)
    })

    // @ts-ignore
    return matchingVals.map(props => new this(props))
  }

  BaseClass.findById = async function(id: string): Promise<ActiveRecord<Schema> | null> {
    const db = this.getDb()

    if (!id) return null

    const snapshotAtId = await db.ref(this.key).child(id).once('value')
    const valAtId = snapshotAtId.val()
    if (valAtId) {
      const player = new this(valAtId)
      return player
    } else {
      return null
    }
  }

  BaseClass.findOne = async function(props): Promise<ActiveRecord<Schema> | null> {
    const tableValues = await getTableVals()
    const firstMatch = tableValues.find(record => whereEq(props, record))
    if (firstMatch) {
      // @ts-ignore
      return new this(firstMatch)
    } else {
      return null
    }
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