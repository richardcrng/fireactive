import { retrieve, Relatable } from "./relations"
import { ActiveClass } from "../../types/class.types"
import { LazyHasMany } from "../../types/relations.types"

export function findByIds<RelatingInstance, RelatedInstance = unknown>(related: Relatable, cb: () => string[]): LazyHasMany<RelatingInstance, RelatedInstance> {
  return async function (this: RelatingInstance) {
    const ids = cb()
    const RelatedClass = retrieve(related) as ActiveClass
    const promises = ids.map(id => RelatedClass.findById(id))
    // @ts-ignore
    const results = await Promise.all(promises) as (RelatedInstance | null)[]
    return results.filter((result: any) => result) as RelatedInstance[]
  }
}