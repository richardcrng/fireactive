import { get } from 'lodash'
import { Relatable, retrieve } from './relations'
import { ClassDefinition, ActiveClass } from "../../types/class.types"
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
export function findById<RelatingClass extends ClassDefinition, RelatedClass extends ClassDefinition = ClassDefinition>(related: Relatable, prop: keyof InstanceType<RelatingClass>): LazyHasOne<RelatingClass, RelatedClass>

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
export function findById<RelatingClass extends ClassDefinition, RelatedClass extends ClassDefinition>(related: Relatable, cb: () => string | undefined): LazyHasOne<RelatingClass, RelatedClass>

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
export function findById<RelatingClass extends ClassDefinition, RelatedClass extends ClassDefinition>(related: Relatable, path: string[]): LazyHasOne<RelatingClass, RelatedClass>

export function findById<RelatingClass extends ClassDefinition, RelatedClass extends ClassDefinition>(related: Relatable, lookup: keyof InstanceType<RelatingClass> | string[] | Function): LazyHasOne<RelatingClass, RelatedClass> {
  return async function (this: InstanceType<RelatingClass>) {
    const id: string = typeof lookup === 'function' ? lookup()
      : Array.isArray(lookup) ? get(this, lookup)
        : get(this, lookup)

    const RelatedClass = retrieve(related) as ActiveClass

    const res = await RelatedClass.findById(id)

    return res as InstanceType<RelatedClass>
  }
}
