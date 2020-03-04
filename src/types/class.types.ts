import { RecordSchema, ObjectFromRecord, ToCreateRecord } from "./schema.types"

/**
 * An `ActiveRecord<S>` _instance_ of the `BaseClass<S>`. 
 * This interface holds the instance methods and properties.
 */
export type ActiveRecord<S extends RecordSchema> = ObjectFromRecord<S> & {
  constructor: BaseClass<S>

  /**
   * Returns the `ActiveRecord`'s `_id` property if it has one, or
   *  generates one if one does not yet exist.
   * 
   * @returns The `ActiveRecord`'s `_id`, whether existing or generated
   */
  getId(): string,

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
 * A _class_ to create `ActiveRecord<S>` instances from the `RecordSchema`, `S`. 
 * This interface holds the static class methods and properties.
 * 
 * @template S - a RecordSchema
 */
export interface BaseClass<S extends RecordSchema> {
  /**
   * Create an instance of the ActiveRecord -
   *  not yet saved to the database
   */
  new(props: ToCreateRecord<S> & { _id?: string }): ActiveRecord<S>,
  prototype: ActiveRecord<S>,

  /**
   * The 'table' key which this model uses in the Firebase RTD.
   */
  key: string,

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