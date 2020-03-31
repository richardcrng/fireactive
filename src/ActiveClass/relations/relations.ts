import { get } from 'lodash'
import { ActiveClass, ClassConstructor } from "../../types/class.types";

type Relatable<ThisClass extends ClassConstructor = ClassConstructor> = string | ThisClass

export interface LazyHasOne<RelatingClass extends ClassConstructor, RelatedClass extends ClassConstructor> {
  (this: InstanceType<RelatingClass>): Promise<InstanceType<RelatedClass> | null>
}

export interface LazyHasMany<RelatingClass extends ClassConstructor, RelatedClass extends ClassConstructor> {
  (this: InstanceType<RelatingClass>): Promise<InstanceType<RelatedClass>[]>
}

const classes: { [className: string]: ClassConstructor } = {}

const retrieve = <RelatedClass>(related: Relatable): RelatedClass => {
  if (typeof related !== 'string') {
    return related as unknown as RelatedClass
  } else if (classes[related]) {
    return classes[related] as unknown as RelatedClass
  } else {
    throw new Error('Could not find class')
  }
}

export const store = (ActiveClass: ClassConstructor, key?: string): void => {
  classes[key || ActiveClass.name] = ActiveClass
}

export function findById<RelatingClass extends ClassConstructor, RelatedClass extends ClassConstructor>(related: Relatable, cb: () => string | undefined): LazyHasOne<RelatingClass, RelatedClass>

export function findById<RelatingClass extends ClassConstructor, RelatedClass extends ClassConstructor>(related: Relatable, prop: string): LazyHasOne<RelatingClass, RelatedClass>

export function findById<RelatingClass extends ClassConstructor, RelatedClass extends ClassConstructor>(related: Relatable, path: string[]): LazyHasOne<RelatingClass, RelatedClass>

export function findById<RelatingClass extends ClassConstructor, RelatedClass extends ClassConstructor>(related: Relatable, lookup: string | string[] | Function): LazyHasOne<RelatingClass, RelatedClass> {
  return async function(this: InstanceType<RelatingClass>) {
    const id: string = typeof lookup === 'function' ? lookup()
      : Array.isArray(lookup) ? get(this, lookup)
      : get(this, lookup)

    const RelatedClass = retrieve(related) as ActiveClass

    const res = await RelatedClass.findById(id)

    return res as InstanceType<RelatedClass>
  }
}


export function findByIds<RelatingClass extends ClassConstructor, RelatedClass extends ClassConstructor>(related: Relatable, cb: () => string[]): LazyHasMany<RelatingClass, RelatedClass> {
  return async function(this: InstanceType<RelatingClass>) {
    const ids = cb()
    const RelatedClass = retrieve(related) as ActiveClass
    const promises = ids.map(id => RelatedClass.findById(id))
    // @ts-ignore
    const results = await Promise.all(promises) as (InstanceType<RelatedClass> | null)[]
    return results.filter((result: any) => result) as InstanceType<RelatedClass>[]
  }
}