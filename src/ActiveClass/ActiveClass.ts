import pluralize from 'pluralize'
import { ActiveClass } from "../types/class.types";
import { RecordSchema } from '../types/schema.types';
import makeActiveClassConstructor from './constructor/makeActiveClassConstructor';
import addActiveClassStatics from './statics/addActiveClassStatics';
import addActiveClassInstances from './instances/addActiveClassInstances';
import addActiveClassCache from './statics/addActiveClassCache';

/**
 * Create a `ActiveClass<Schema>`, where `Schema` is an Active `RecordSchema`.
 * 
 * @param className - The name used as a basis for the Firebase RTD table
 * @param schema - The `RecordSchema` for an `ActiveRecord` of the resultant class
 * 
 * @returns The `ActiveClass<S>`.
 * @template Schema - A `RecordSchema`
 */
function ActiveClass<Schema extends RecordSchema>(className: string, schema: Schema) {
  // our JavaScript `Record` variable, with a constructor type
  let ActiveClass: ActiveClass<Schema>;

  const tableName = pluralize.plural(className)

  // Constructor function does not satisfy the whole `ActiveClass` type
  //  so it needs to be case to any
  ActiveClass = <any>makeActiveClassConstructor(className, schema);

  // adding static properties/methods onto `ActiveClass`
  // @ts-ignore : infinitely deep :(
  addActiveClassStatics(ActiveClass)

  // @ts-ignore : infinitely deep :(
  addActiveClassCache(ActiveClass)

  // adding instance methods and properties onto `ActiveClass.prototype`
  // @ts-ignore : infinitely deep :(
  addActiveClassInstances(ActiveClass, { schema, tableName })

  return ActiveClass
}

export default ActiveClass