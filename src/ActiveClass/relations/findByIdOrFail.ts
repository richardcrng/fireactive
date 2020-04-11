import { get } from 'lodash'
import { Relatable, retrieve } from './relations'
import { ActiveClass, ClassDefinition } from "../../types/class.types"
import { LazyHasOneOrFail } from "../../types/relations.types"

/**
 * Create a `LazyHasOneOrFail` relation between a relating `ActiveClass`
 *  and some related `ActiveClass`. The relation is made through
 *  a property on the relating `ActiveClass`, which is retrieved
 *  through `prop` such that the value is used as an `_id` to find
 *  a member of the related `ActiveClass`
 * 
 * @param related The related `ActiveClass` or its name
 * @param prop The prop field 
 * @template RelatingInstance - The instance which owns the relation
 * @template RelatedInstance - The instance which is being related to
 * 
 * @returns a `LazyHasOneOrFail` relation
 */
export function findByIdOrFail<RelatingInstance, RelatedInstance = unknown>(related: Relatable<ClassDefinition<RelatedInstance>>, prop: keyof RelatingInstance): LazyHasOneOrFail<RelatingInstance, RelatedInstance>

/**
 * Create a `LazyHasOneOrFail` relation between a relating `ActiveClass`
 *  and some related `ActiveClass`. The relation is made through
 *  a property on the relating `ActiveClass`, which is retrieved
 *  through the return value of executing `cb`, used as an `_id`
 *  to find a member of the related `ActiveClass`
 *
 * @param related The related `ActiveClass` or its name
 * @param cb A function that returns a string `_id`
 * @template RelatingInstance - The instance which owns the relation
 * @template RelatedInstance - The instance which is being related to
 *
 * @returns a `LazyHasOneOrFail` relation
 */
export function findByIdOrFail<RelatingInstance, RelatedInstance = unknown>(related: Relatable<ClassDefinition<RelatedInstance>>, cb: () => string | undefined): LazyHasOneOrFail<RelatingInstance, RelatedInstance>

/**
 * Create a `LazyHasOneOrFail` relation between a relating `ActiveClass`
 *  and some related `ActiveClass`. The relation is made through
 *  a property on the relating `ActiveClass`, which is retrieved
 *  through the property `path` array such that the value is used
 *  as an `_id` to find a member of the related `ActiveClass`
 *
 * @param related The related `ActiveClass` or its name
 * @param prop The prop field
 * @template RelatingInstance - The instance which owns the relation
 * @template RelatedInstance - The instance which is being related to
 *
 * @returns a `LazyHasOneOrFail` relation
 */
export function findByIdOrFail<RelatingInstance, RelatedInstance = unknown>(related: Relatable<ClassDefinition<RelatedInstance>>, path: string[]): LazyHasOneOrFail<RelatingInstance, RelatedInstance>

export function findByIdOrFail<RelatingInstance, RelatedInstance = unknown>(related: Relatable<ClassDefinition<RelatedInstance>>, lookup: keyof RelatingInstance | string[] | Function): LazyHasOneOrFail<RelatingInstance, RelatedInstance> {
  return async function (this: RelatingInstance) {
    const id: string = typeof lookup === 'function' ? lookup()
      : Array.isArray(lookup) ? get(this, lookup)
        : get(this, lookup)

    const RelatedClass = retrieve(related) as ActiveClass

    const res = await RelatedClass.findByIdOrFail(id)

    return res as RelatedInstance
  }
}
