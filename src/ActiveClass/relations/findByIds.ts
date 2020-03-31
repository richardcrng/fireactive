import { retrieve, Relatable } from "./relations"
import { ClassDefinition, ActiveClass } from "../../types/class.types"
import { LazyHasMany } from "../../types/relations.types"

export function findByIds<RelatingClass extends ClassDefinition, RelatedClass extends ClassDefinition>(related: Relatable, cb: () => string[]): LazyHasMany<RelatingClass, RelatedClass> {
  return async function (this: InstanceType<RelatingClass>) {
    const ids = cb()
    const RelatedClass = retrieve(related) as ActiveClass
    const promises = ids.map(id => RelatedClass.findById(id))
    // @ts-ignore
    const results = await Promise.all(promises) as (InstanceType<RelatedClass> | null)[]
    return results.filter((result: any) => result) as InstanceType<RelatedClass>[]
  }
}