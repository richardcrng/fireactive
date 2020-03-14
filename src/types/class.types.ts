import { RecordSchema, ObjectFromRecord, ToCreateRecord, RecordProps } from "./schema.types"
import { SyncOpts } from "./sync.types"

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
   * Reloads the instance's properties from the Firebase database
   * 
   * @returns The values reloaded from the Firebase database
   */
  reload(): Promise<ObjectFromRecord<S>>,

  /**
   * Save the instance to Firebase
   * 
   * @returns The values saved to the Firebase database
   */
  save(): Promise<ObjectFromRecord<S>>,


  /**
   * Save the instance to Firebase and turns on syncing
   * 
   * @returns The values saved to the Firebase database
   */
  saveAndSync(syncOpts?: Partial<SyncOpts>): Promise<ObjectFromRecord<S>>,
  

  /**
   * Returns the current syncing options for the `ActiveRecord`
   */
  syncOpts(): SyncOpts

  /**
   * Update sync options and return the overall syncing options
   *  for the `ActiveRecord`
   * @param syncOpts - The sync options to update
   * @returns the current syncing options after the update
   */
  syncOpts(syncOpts: Partial<SyncOpts>): SyncOpts


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
  create(props: ToCreateRecord<S> & { _id?: string }): Promise<ActiveRecord<S>>,

  /**
   * Delete all `ActiveRecord`s from the database that
   *  match the passed in `props`
   * 
   * @param props Properties to create the Record with
   * @returns a `Promise` that resolves with the count of deleted records
   */
  delete(props: Partial<ObjectFromRecord<S>>): Promise<number>,


  /**
   * Delete the first `ActiveRecord` from the database that
   *  matches the passed in `props`
   * 
   * @param props Properties to create the Record with
   * @returns a `Promise` that resolves to whether or not a record was deleted
   */
  deleteOne(props: Partial<ObjectFromRecord<S>>): Promise<boolean>,

  /**
   * Find all `ActiveRecord`s from the database that
   *  match the passed in `props`
   * 
   * @param props 
   * @returns an array of `ActiveRecord<S>`
   */
  find(props: Partial<ObjectFromRecord<S>>): Promise<ActiveRecord<S>[]>,

  /**
   * Find a single ActiveRecord in the database by id
   * 
   * @param id - id of the ActiveRecord to find
   * @returns the `ActiveRecord` found, or `null` if none
   */
  findById(id: string): Promise<ActiveRecord<S> | null>,

  /**
   * Find a single ActiveRecord in the database by
   *  retrieving the first that matches the passed in `props`
   * 
   * @param props 
   * @returns the `ActiveRecord` found, or `null` if no record was found
   */
  findOne(props: Partial<ObjectFromRecord<S>>): Promise<ActiveRecord<S> | null>,

  /**
   * Return the Firebase Real-Time Database instance and interface
   * @returns `firebase.database.Database`
   */
  getDb(): firebase.database.Database,

  /**
   * Updates all `ActiveRecord`s from the database that
   *  match the passed in `props` with `updateProps`
   * 
   * @param props - props to match by
   * @param updateProps - props to update
   * @returns an array of `ActiveRecord<S>` that were updated
   */
  update(props: Partial<ObjectFromRecord<S>>, updateProps: Partial<RecordProps<S>>): Promise<ActiveRecord<S>[]>

  /**
   * Update a single ActiveRecord in the database by
   *  retrieving the first that matches the passed in `props`
   *  and updating it using `updateProps`
   * 
   * @param props 
   * @returns the updated `ActiveRecord` if there is one, or `null` otherwise
   */
  updateOne(props: Partial<ObjectFromRecord<S>>, updateProps: Partial<RecordProps<S>>): Promise<ActiveRecord<S> | null>,
}