import { DocumentSchema, ObjectFromDocument, ToCreateDocument, DocumentProps, FirebaseTable } from "./schema.types"
import { SyncOpts } from "./sync.types"

export type ClassDefinition<T = unknown> = { new(...args: any[]): T; };

/**
 * An `ActiveDocument<S>` _instance_ of the `ActiveClass<S>`. 
 * This interface holds the instance methods and properties.
 */
export type ActiveDocument<S extends DocumentSchema = DocumentSchema> = ObjectFromDocument<S> & {
  constructor: ActiveClass<S>

  /**
   * Returns the `ActiveDocument`'s `_id` property if it has one, or
   *  generates one if one does not yet exist.
   * 
   * @returns The `ActiveDocument`'s `_id`, whether existing or generated
   */
  getId(): string,

  /**
   * Reloads the instance's properties from the Firebase database
   * 
   * @returns The values reloaded from the Firebase database
   */
  reload(): Promise<ObjectFromDocument<S>>,

  /**
   * Get a `Reference` for the document and/or a child within it
   * 
   * @param path - a relative path from the document
   * @returns a `Reference` for the document, to its relative path
   *  if supplied
   */
  ref(path?: string): firebase.database.Reference,

  /**
   * Save the instance to Firebase
   * 
   * @returns The values saved to the Firebase database
   */
  save(): Promise<ObjectFromDocument<S>>,


  /**
   * Save the instance to Firebase and turns on syncing
   * 
   * @returns The values saved to the Firebase database
   */
  saveAndSync(syncOpts?: Partial<SyncOpts>): Promise<ObjectFromDocument<S>>,

  /**
   * A promise resolved when all pending setter promises to
   *  the database have been completed
   * 
   * @returns a `Promise`
   */
  pendingSetters(): Promise<any>,

  /**
   * An array of all pending setter promises to
   *  the database
   * 
   * @returns the array of all pending setter promises
   *  to the database
   */
  pendingSetters({ array }: { array: true }): Promise<any>[],

  /**
   * Returns the current syncing options for the `ActiveDocument`
   */
  syncOpts(): SyncOpts

  /**
   * Update sync options and return the overall syncing options
   *  for the `ActiveDocument`
   * @param syncOpts - The sync options to update
   * @returns the current syncing options after the update
   */
  syncOpts(syncOpts: Partial<SyncOpts>): SyncOpts


  /**
   * Return the raw object properties (as schematised)
   * @returns an object with type properties `ObjectFromDocument<S>`
   */
  toObject(): ObjectFromDocument<S>
}




/**
 * A _class_ to create `ActiveDocument<S>` instances from the `DocumentSchema`, `S`. 
 * This interface holds the static class methods and properties.
 * 
 * @template S - a DocumentSchema
 */
export type ActiveClass<S extends DocumentSchema = DocumentSchema> = {
  /**
   * Create an instance of the ActiveDocument -
   *  not yet saved to the database
   */
  new(props: ToCreateDocument<S> & { _id?: string }): ActiveDocument<S>,

  prototype: ActiveDocument<S>,


  /**
   * The schema forming the basis of the `ActiveClass`
   */
  readonly schema: Readonly<S>,

  /**
   * The 'table' key which this model uses in the Firebase RTD.
   */
  key: string,

  /**
   * Caches the current table value
   * 
   * @param {boolean} [listenForUpdates = true] whether the cache should
   *  listen and automatically update to table changes
   * 
   * @returns the cached object table for the class
   */
  cache(listenForUpdates?: boolean): Promise<FirebaseTable<S>>,

  /**
   * The currently cached object table for the class
   */
  cached: FirebaseTable<S>,

  /**
   * Create a new model and save it to the database
   * 
   * @param props Properties to create the Document with
   * @returns a `Promise` that resolves into the created document
   */
  create<ThisClass extends ActiveClass<S> = ActiveClass<S>>(this: ThisClass, props: ToCreateDocument<S> & { _id?: string }): Promise<InstanceType<ThisClass>>,

  /**
   * Delete all `ActiveDocument`s from the database that
   *  match the passed in `props`
   * 
   * @param props Properties to create the Document with
   * @returns a `Promise` that resolves with the count of deleted documents
   */
  delete(props: Partial<ObjectFromDocument<S>>): Promise<number>,

  /**
   * Delete the first `ActiveDocument` from the database that
   *  matches the passed in `props`
   * 
   * @param props Properties to create the Document with
   * @returns a `Promise` that resolves to whether or not a document was deleted
   */
  deleteOne(props: Partial<ObjectFromDocument<S>>): Promise<boolean>,

  /**
   * Find all `ActiveDocument`s from the database that
   *  match the passed in `props`
   * 
   * @param props 
   * @returns an array of `ActiveDocument<S>`
   */
  find<ThisClass extends ActiveClass<S> = ActiveClass<S>>(this: ThisClass, props: Partial<ObjectFromDocument<S>>): Promise<InstanceType<ThisClass>[]>,

  /**
   * Find a single ActiveDocument in the database by id
   * 
   * @param id - id of the ActiveDocument to find
   * @returns the `ActiveDocument` found, or `null` if none
   */
  findById<ThisClass extends ActiveClass<S> = ActiveClass<S>>(this: ThisClass, id: string): Promise<InstanceType<ThisClass> | null>,

  /**
   * Find a single ActiveDocument in the database by id
   *  and throw an error if it does not exist
   * 
   * @param id - id of the ActiveDocument to find
   * @returns the `ActiveDocument` found
   */
  findByIdOrFail<ThisClass extends ActiveClass<S> = ActiveClass<S>>(this: ThisClass, id: string): Promise<InstanceType<ThisClass>>,

  /**
   * Find a single ActiveDocument in the database by
   *  retrieving the first that matches the passed in `props`
   * 
   * @param props 
   * @returns the `ActiveDocument` found, or `null` if no document was found
   */
  findOne<ThisClass extends ActiveClass<S> = ActiveClass<S>>(this: ThisClass, props: Partial<ObjectFromDocument<S>>): Promise<InstanceType<ThisClass> | null>,

  /**
   * Create an `ActiveDocument` from some props, such that it
   *  is syncing to and from the database.
   * 
   * This is equivalent to using the `new` constructor
   *  (except an `_id` **must** be provided) and immediately
   *  turning on syncing to and from the database (hence
   *  why `_id` is necessary).
   * 
   * @param props 
   * @returns the `ActiveDocument`
   */
  from<ThisClass extends ActiveClass<S> = ActiveClass<S>>(this: ThisClass, props: ObjectFromDocument<S> & { _id: string }): InstanceType<ThisClass>,

  /**
   * Return the Firebase Real-Time Database instance and interface
   * @returns `firebase.database.Database`
   */
  getDb(): firebase.database.Database,

  /**
   * Get a `Reference` for the table and/or a child within it
   * 
   * @param path - a relative path from the table
   * @returns a `Reference` for the table, to its relative path
   *  if supplied
   */
  ref(path?: string): firebase.database.Reference,

  /**
   * Updates all `ActiveDocument`s from the database that
   *  match the passed in `matchProps` with `updateProps`
   * 
   * @param matchProps - props to match by
   * @param updateProps - props to update
   * @returns an array of `ActiveDocument<S>` that were updated
   */
  update<ThisClass extends ActiveClass<S> = ActiveClass<S>>(this: ThisClass, matchProps: Partial<ObjectFromDocument<S>>, updateProps: Partial<DocumentProps<S>>): Promise<InstanceType<ThisClass>[]>

  /**
   * Update a single ActiveDocument in the database by
   *  retrieving the first that matches the passed in `matchProps`
   *  and updating it using `updateProps`
   * 
   * @param matchProps - props to match by
   * @param updateProps - props to update
   * @returns the updated `ActiveDocument` if there is one, or `null` otherwise
   */
  updateOne<ThisClass extends ActiveClass<S> = ActiveClass<S>>(this: ThisClass, matchProps: Partial<ObjectFromDocument<S>>, updateProps: Partial<DocumentProps<S>>): Promise<InstanceType<ThisClass> | null>,


  value(props: Partial<ObjectFromDocument<S>>): Promise<ObjectFromDocument<S> | null>
  values(props?: Partial<ObjectFromDocument<S>>): Promise<ObjectFromDocument<S>[]>,
}