import { whereEq } from 'ramda'
import { ActiveClass, ActiveRecord } from "../../types/class.types";
import { getFirebaseDatabase } from "../../initialize/initialize";
import { RecordSchema, ObjectFromRecord } from "../../types/schema.types";
import ActiveClassError from '../Error/ActiveClassError';

/**
 * Adds default class methods and properties onto the `ActiveClass`
 */
const addActiveClassStatics = <Schema extends RecordSchema, ThisClass extends ActiveClass<Schema> = ActiveClass<Schema>>(
  ActiveClass: ThisClass
): void => {

  // utilities
  ActiveClass.from = function(props) {
    // @ts-ignore
    const record = new this(props)
    record.syncOpts({ fromDb: true, toDb: true })
    return record
  }

  ActiveClass.getDb = function () {
    try {
      const database = getFirebaseDatabase()
      return database
    } catch (err) {
      throw ActiveClassError.from(err, {
        what: `Could not find the Firebase Realtime Database for your ${this.name} data`
      })
    }
  }

  ActiveClass.ref = function(path?: string): firebase.database.Reference {
    const db = this.getDb()
    const tableRef = db.ref(this.key)
    return path
      ? tableRef.child(path)
      : tableRef
  }

  ActiveClass.values = async function (props?): Promise<ObjectFromRecord<Schema>[]> {
    const cache = await this.cache()
    const array = Object.values(cache)
    return props
      ? array.filter(record => whereEq(props, record))
      : array
  }

  ActiveClass.value = async function(props?): Promise<ObjectFromRecord<Schema> | null> {
    const values = await this.values()
    // @ts-ignore
    return values.find(record => whereEq(props, record)) || null
  }

  // main

  // @ts-ignore : inheritance
  ActiveClass.create = async function (props): Promise<ActiveRecord<Schema>> {
    try {
      const record = new this({ ...props })
      record.syncOpts({ fromDb: true, toDb: true }) // sync by default when using `create`
      await record.ref().set(record.toObject())
      return record
    } catch (err) {
      throw ActiveClassError.from(err, {
        what: `Could not create ${this.name}`
      })
    }
  }

  ActiveClass.delete = async function(props): Promise<number> {
    const tableValues = await this.values()
    // @ts-ignore
    const matchingVals = tableValues.filter(record => whereEq(props, record))
    await Promise.all(matchingVals.map(async (val) => {
      if (val._id) await this.ref(val._id).remove()
    }))
    return matchingVals.length
  }

  ActiveClass.deleteOne = async function (props): Promise<boolean> {
    const tableValues = await this.values()
    const firstMatch = tableValues.find(record => whereEq(props, record))
    if (firstMatch && firstMatch._id) {
      await this.ref(firstMatch._id).remove()
      return true
    } else {
      return false
    }
  }

  // @ts-ignore : inheritance
  ActiveClass.find = async function(props): Promise<ActiveRecord<Schema>[]> {
    const matchingVals = await this.values(props)
    // @ts-ignore
    return matchingVals.map(props => {
      // @ts-ignore
      return this.from(props)
    })
  }

  // @ts-ignore : inheritance
  ActiveClass.findById = async function(id: string): Promise<ActiveRecord<Schema> | null> {
    if (!id) return null

    const snapshotAtId = await this.ref(id).once('value')
    const valAtId = snapshotAtId.val()
    if (valAtId) {
      // @ts-ignore
      return this.from(valAtId)
    } else {
      return null
    }
  }

  // @ts-ignore : inheritance
  ActiveClass.findOne = async function(props): Promise<ActiveRecord<Schema> | null> {
    const firstMatch = await this.value(props)
    if (!firstMatch) return null
    // @ts-ignore
    return this.from(firstMatch)
  }

  // @ts-ignore : inheritance
  ActiveClass.update = async function(props, newProps): Promise<ActiveRecord<Schema>[]> {
    const matchingVals = await this.values(props)
    const updatedVals = matchingVals.map(val => ({ ...val, ...newProps }))
    await Promise.all(updatedVals.map(async (val) => {
      if (val._id) await this.ref(val._id).update(newProps)
    }))
    return updatedVals.map(val => {
      // @ts-ignore
      return this.from(val)
    })
  }

  // @ts-ignore : inheritance
  ActiveClass.updateOne = async function (props, newProps): Promise<ActiveRecord<Schema> | null> {
    const firstMatch = await this.value(props)
    if (!firstMatch) return null
    const updatedMatch = { ...firstMatch, ...newProps }
    if (firstMatch && firstMatch._id) await this.ref(firstMatch._id).update(newProps)
    // @ts-ignore
    return this.from(updatedMatch)
  }
}

export default addActiveClassStatics