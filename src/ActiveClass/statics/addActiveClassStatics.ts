import { whereEq } from 'ramda'
import { ActiveClass, ActiveRecord } from "../../types/class.types";
import { getFirebaseDatabase } from "../../initialize/initialize";
import { RecordSchema, ObjectFromRecord } from "../../types/schema.types";

/**
 * Adds default class methods and properties onto the `ActiveClass`
 */
const addActiveClassStatics = <Schema extends RecordSchema>(
  ActiveClass: ActiveClass<Schema>
): void => {

  const tableRef = () => ActiveClass.getDb().ref(ActiveClass.key)

  async function getTableVals(): Promise<ObjectFromRecord<Schema>[]> {
    const tableSnapshot = await ActiveClass.ref().once('value')
    const tableVal = tableSnapshot.val() || {}
    return Object.values(tableVal) as ObjectFromRecord<Schema>[]
  }

  async function getFirstMatchFromTable(
    props: Partial<ObjectFromRecord<Schema>>
  ): Promise<ObjectFromRecord<Schema> | null> {
    const tableValues = await getTableVals()
    // @ts-ignore
    return tableValues.find(record => whereEq(props, record))
  }

  async function getMatchingTableVals(props: Partial<ObjectFromRecord<Schema>>): Promise<ObjectFromRecord<Schema>[]> {
    const tableValues = await getTableVals()
    // @ts-ignore
    const matchingVals: ObjectFromRecord<Schema>[] = tableValues.filter(record => whereEq(props, record))
    return matchingVals
  }


  // main
  ActiveClass.create = async function (props): Promise<ActiveRecord<Schema>> {
    const record = new this({ ...props })
    const _id = record.getId()
    record.syncOpts({ fromDb: true, toDb: true }) // sync by default when using `create`
    await record.ref().set({ ...props, _id })
    return record
  }

  ActiveClass.delete = async function(props): Promise<number> {
    const tableValues = await getTableVals()
    // @ts-ignore
    const matchingVals = tableValues.filter(record => whereEq(props, record))
    await Promise.all(matchingVals.map(async (val) => {
      if (val._id) await this.ref(val._id).remove()
    }))
    return matchingVals.length
  }

  ActiveClass.deleteOne = async function (props): Promise<boolean> {
    const tableValues = await getTableVals()
    const firstMatch = tableValues.find(record => whereEq(props, record))
    if (firstMatch && firstMatch._id) {
      await this.ref(firstMatch._id).remove()
      return true
    } else {
      return false
    }
  }

  ActiveClass.find = async function(props): Promise<ActiveRecord<Schema>[]> {
    const matchingVals = await getMatchingTableVals(props)
    // @ts-ignore
    return matchingVals.map(props => new this(props))
  }

  ActiveClass.findById = async function(id: string): Promise<ActiveRecord<Schema> | null> {
    const db = this.getDb()

    if (!id) return null

    const snapshotAtId = await this.ref(id).once('value')
    const valAtId = snapshotAtId.val()
    if (valAtId) {
      const player = new this(valAtId)
      return player
    } else {
      return null
    }
  }

  ActiveClass.findOne = async function(props): Promise<ActiveRecord<Schema> | null> {
    const firstMatch = await getFirstMatchFromTable(props)
    if (!firstMatch) return null
    // @ts-ignore
    return new this(firstMatch)
  }

  ActiveClass.getDb = function () {
    const database = getFirebaseDatabase()
    if (!database) {
      throw new Error('Cannot get Firebase Real-Time Database instance: have you intialised the Firebase connection?')
    }
    return database
  }

  ActiveClass.ref = function(this: ActiveClass<Schema>, path?: string): firebase.database.Reference {
    return path
      ? tableRef().child(path)
      : tableRef()
  }

  ActiveClass.update = async function(props, newProps): Promise<ActiveRecord<Schema>[]> {
    const matchingVals = await getMatchingTableVals(props)
    const updatedVals = matchingVals.map(val => ({ ...val, ...newProps }))
    await Promise.all(updatedVals.map(async (val) => {
      if (val._id) await this.ref(val._id).update(newProps)
    }))
    // @ts-ignore
    return updatedVals.map(val => new this(val))
  }

  ActiveClass.updateOne = async function (props, newProps): Promise<ActiveRecord<Schema> | null> {
    const firstMatch = await getFirstMatchFromTable(props)
    if (!firstMatch) return null
    const updatedMatch = { ...firstMatch, ...newProps }
    if (firstMatch && firstMatch._id) await this.ref(firstMatch._id).update(newProps)
    // @ts-ignore
    return new this(updatedMatch)
  }
}

export default addActiveClassStatics