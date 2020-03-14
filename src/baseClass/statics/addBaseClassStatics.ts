import { whereEq } from 'ramda'
import { BaseClass, ActiveRecord } from "../../types/class.types";
import { getFirebaseDatabase } from "../../initialize/initialize";
import { RecordSchema, ToCreateRecord, ObjectFromRecord } from "../../types/schema.types";
import baseClass from '../baseClass';

/**
 * Adds default class methods and properties onto the `BaseClass`
 */
const addBaseClassStatics = <Schema extends RecordSchema>(
  BaseClass: BaseClass<Schema>
): void => {

  // helpers
  function getBaseClassRef() {
    const db = BaseClass.getDb()
    return db.ref(BaseClass.key)
  }

  async function getTableVals(): Promise<ObjectFromRecord<Schema>[]> {
    const tableSnapshot = await getBaseClassRef().once('value')
    const tableVal = tableSnapshot.val()
    const tableValues: ObjectFromRecord<Schema>[] = Object.values(tableVal)
    return tableValues
  }

  // main
  BaseClass.create = async function (props): Promise<ActiveRecord<Schema>> {
    const record = new this({ ...props })
    const _id = record.getId()
    await getBaseClassRef().child(_id).set({ ...props, _id })
    return record
  }

  BaseClass.delete = async function(props): Promise<number> {
    const tableValues = await getTableVals()
    // @ts-ignore
    const matchingVals = tableValues.filter(record => whereEq(props, record))
    await Promise.all(matchingVals.map(async (val) => {
      if (val._id) await getBaseClassRef().child(val._id).remove()
    }))
    return matchingVals.length
  }

  BaseClass.deleteOne = async function (props): Promise<boolean> {
    const tableValues = await getTableVals()
    const firstMatch = tableValues.find(record => whereEq(props, record))
    if (firstMatch?._id) {
      await getBaseClassRef().child(firstMatch._id).remove()
      return true
    } else {
      return false
    }
  }

  BaseClass.find = async function(props): Promise<ActiveRecord<Schema>[]> {
    const tableValues = await getTableVals()
    // @ts-ignore
    const matchingVals: ObjectFromRecord<Schema>[] = tableValues.filter(record => whereEq(props, record))
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

  BaseClass.update = async function(props, newProps): Promise<ActiveRecord<Schema>[]> {
    const tableValues = await getTableVals()
    // @ts-ignore
    const matchingVals: ObjectFromRecord<Schema>[] = tableValues.filter(record => whereEq(props, record))
    const updatedVals = matchingVals.map(val => ({ ...val, ...newProps }))
    await Promise.all(updatedVals.map(async (val) => {
      if (val._id) await getBaseClassRef().child(val._id).update(newProps)
    }))
    // @ts-ignore
    return updatedVals.map(val => new this(val))
  }

  BaseClass.updateOne = async function (props, newProps): Promise<ActiveRecord<Schema> | null> {
    const tableValues = await getTableVals()
    const firstMatch = tableValues.find(record => whereEq(props, record))
    if (!firstMatch) return null
    const updatedMatch = { ...firstMatch, ...newProps }
    if (firstMatch?._id) await getBaseClassRef().child(firstMatch._id).update(newProps)
    // @ts-ignore
    return new this(updatedMatch)
  }
}

export default addBaseClassStatics