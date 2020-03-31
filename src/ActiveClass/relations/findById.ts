import { get } from 'lodash'
import { Relatable, retrieve } from './relations'
import { ClassDefinition, ActiveClass } from "../../types/class.types"
import { LazyHasOne } from "../../types/relations.types"

export function findById<RelatingClass extends ClassDefinition, RelatedClass extends ClassDefinition = ClassDefinition>(related: Relatable, prop: keyof InstanceType<RelatingClass>): LazyHasOne<RelatingClass, RelatedClass>

export function findById<RelatingClass extends ClassDefinition, RelatedClass extends ClassDefinition>(related: Relatable, cb: () => string | undefined): LazyHasOne<RelatingClass, RelatedClass>

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
