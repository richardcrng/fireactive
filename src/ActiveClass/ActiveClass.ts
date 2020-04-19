import { ActiveClass } from "../types/class.types";
import { RecordSchema } from '../types/schema.types';
import makeActiveClassConstructor from './constructor/makeActiveClassConstructor';
import addActiveClassStatics from './statics/addActiveClassStatics';
import addActiveClassInstances from './instances/addActiveClassInstances';
import addActiveClassCache from './statics/addActiveClassCache';

/**
 * Create a `ActiveClass<Schema>`, where `Schema` is an Active `RecordSchema`.
 * 
 * @param schema - The `RecordSchema` for an `ActiveRecord` of the resultant class
 * @param className - The name used as a basis for the Firebase RTD table
 * 
 * @returns The `ActiveClass<S>`.
 * @template Schema - A `RecordSchema`
 */
function ActiveClass<Schema extends RecordSchema>(schema: Schema, className?: string) {
  // our JavaScript `Record` variable, with a constructor type
  let ActiveClass: ActiveClass<Schema>;

  const readonlySchema = Object.freeze(schema)

  // Constructor function does not satisfy the whole `ActiveClass` type
  //  so it needs to be case to any
  ActiveClass = <any>makeActiveClassConstructor(schema, className);

  // @ts-ignore: initial assignment for later readonly
  ActiveClass.schema = readonlySchema

  // adding static properties/methods onto `ActiveClass`
  // @ts-ignore : infinitely deep :(
  addActiveClassStatics(ActiveClass)

  // @ts-ignore : infinitely deep :(
  addActiveClassCache(ActiveClass)

  // adding instance methods and properties onto `ActiveClass.prototype`
  // @ts-ignore : infinitely deep :(
  addActiveClassInstances(ActiveClass, { schema })

  return ActiveClass
}

export default ActiveClass