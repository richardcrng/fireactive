import { ClassDefinition } from "./class.types";

export interface LazyHasOne<RelatingInstance, RelatedClass extends ClassDefinition> {
  (this: RelatingInstance): Promise<InstanceType<RelatedClass> | null>
}

export interface LazyHasMany<RelatingInstance, RelatedClass extends ClassDefinition> {
  (this: RelatingInstance): Promise<InstanceType<RelatedClass>[]>
}

export type Relatable<ThisClass extends ClassDefinition = ClassDefinition> = string | ThisClass