import { RecordSchema, ObjectFromRecord, ToCreateRecord } from "./schema.types"

/**
 * The default properties and instance methods on an ActiveRecord
 */
export type ActiveRecord<S extends RecordSchema> = ObjectFromRecord<S> & {
  constructor: RecordModel<S>

  /**
   * Save the instance to Firebase
   */
  save(): Promise<void>,

  /**
   * Return the raw object properties (as schematised)
   * @returns an object with type properties `ObjectFromRecord<S>`
   */
  toObject(): ObjectFromRecord<S>
}




/**
 * A class to create ActiveRecord instances of `S`. 
 * This interface holds the static class methods and properties
 * 
 * @template S - a RecordSchema
 */
export interface RecordModel<S extends RecordSchema> {
  /**
   * Create an instance of the ActiveRecord -
   *  not yet saved to the database
   */
  new(props: ToCreateRecord<S> & { _id?: string }): ActiveRecord<S>;
  prototype: ActiveRecord<S>;

  /**
   * Create a new model and save it to the database
   * 
   * @param props Properties to create the Record with
   * @returns a `Promise` that resolves into the created record
   */
  create(props: ToCreateRecord<S> & { _id?: string }): Promise<ActiveRecord<S>>;

  /**
   * Return the Firebase Real-Time Database instance and interface
   * @returns `firebase.database.Database`
   */
  getDb(): firebase.database.Database;
}