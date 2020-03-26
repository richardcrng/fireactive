import { whereEq } from 'ramda'
import { BaseClass, ActiveRecord } from "../../types/class.types";
import { getFirebaseDatabase } from "../../initialize/initialize";
import { RecordSchema, ObjectFromRecord } from "../../types/schema.types";

/**
 * Adds default class methods and properties onto the `BaseClass`
 */
const addBaseClassCache = <Schema extends RecordSchema>(
  BaseClass: BaseClass<Schema>
): void => {
  let cache: { [_id: string]: ObjectFromRecord<Schema> } = {}

  const tryToUpdateCache = () => {
    try {
      BaseClass.ref().on('value', (snapshot) => {
        cache = snapshot.val()
      })
    } catch (err) {}
  }

  BaseClass.cache = async function (): Promise<{ [_id: string]: ObjectFromRecord<Schema> }> {
    await BaseClass.ref().once('value', async (snapshot) => {
      cache = snapshot.val()
    })
    return cache
  }

  BaseClass.cached = function (): { [_id: string]: ObjectFromRecord<Schema> } {
    return cache
  }
}

export default addBaseClassCache