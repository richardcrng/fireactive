import { retrieve, Relatable } from "./relations"
import { ClassDefinition, ActiveClass } from "../../types/class.types"
import { LazyHasMany } from "../../types/relations.types"

export function findByIds<RelatingInstance, RelatedClass extends ClassDefinition>(related: Relatable, cb: () => string[]): LazyHasMany<RelatingInstance, RelatedClass> {
  return async function (this: RelatingInstance) {
    const ids = cb()
    const RelatedClass = retrieve(related) as ActiveClass
    const promises = ids.map(id => RelatedClass.findById(id))
    // @ts-ignore
    const results = await Promise.all(promises) as (InstanceType<RelatedClass> | null)[]
    return results.filter((result: any) => result) as InstanceType<RelatedClass>[]
  }
}