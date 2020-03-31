import { get } from 'lodash'
import { Relatable, retrieve } from './relations'
import { ActiveClass } from "../../types/class.types"
import { LazyHasOne } from "../../types/relations.types"

/**
 * Create a `LazyHasOne` relation between a relating `ActiveClass`
 *  and some related `ActiveClass`. The relation is made through
 *  a property on the relating `ActiveClass`, which is retrieved
 *  through `prop` such that the value is used as an `_id` to find
 *  a member of the related `ActiveClass`
 * 
 * @param related The related `ActiveClass` or its name
 * @param prop The prop field 
 * 
 * @returns a `LazyHasOne` relation
 */
export function findById<RelatingInstance, RelatedInstance>(related: Relatable, prop: keyof RelatingInstance): LazyHasOne<RelatingInstance, RelatedInstance>

/**
 * Create a `LazyHasOne` relation between a relating `ActiveClass`
 *  and some related `ActiveClass`. The relation is made through
 *  a property on the relating `ActiveClass`, which is retrieved
 *  through the return value of executing `cb`, used as an `_id`
 *  to find a member of the related `ActiveClass`
 *
 * @param related The related `ActiveClass` or its name
 * @param cb A function that returns a string `_id`
 *
 * @returns a `LazyHasOne` relation
 */
export function findById<RelatingInstance, RelatedInstance>(related: Relatable, cb: () => string | undefined): LazyHasOne<RelatingInstance, RelatedInstance>

/**
 * Create a `LazyHasOne` relation between a relating `ActiveClass`
 *  and some related `ActiveClass`. The relation is made through
 *  a property on the relating `ActiveClass`, which is retrieved
 *  through the property `path` array such that the value is used
 *  as an `_id` to find a member of the related `ActiveClass`
 *
 * @param related The related `ActiveClass` or its name
 * @param prop The prop field
 *
 * @returns a `LazyHasOne` relation
 */
export function findById<RelatingInstance, RelatedInstance>(related: Relatable, path: string[]): LazyHasOne<RelatingInstance, RelatedInstance>

export function findById<RelatingInstance, RelatedInstance>(related: Relatable, lookup: keyof RelatingInstance | string[] | Function): LazyHasOne<RelatingInstance, RelatedInstance> {
  return async function (this: RelatingInstance) {
    const id: string = typeof lookup === 'function' ? lookup()
      : Array.isArray(lookup) ? get(this, lookup)
        : get(this, lookup)

    const RelatedClass = retrieve(related) as ActiveClass

    const res = await RelatedClass.findById(id)

    return res as RelatedInstance
  }
}
